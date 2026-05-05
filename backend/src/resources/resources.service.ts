import { Injectable, NotFoundException } from "@nestjs/common";
import { ResourceCategory, ResourceStatus, ResourceType, UserRole } from "@prisma/client";
import { slugify } from "../common/slug.util";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { FindResourcesQueryDto } from "./dto/find-resources-query.dto";
import { UploadResourceAssetDto } from "./dto/upload-resource-asset.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";

type CatalogKind = "videos" | "documentos" | "libros" | "cartillas";

@Injectable()
export class ResourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  findAll(query: FindResourcesQueryDto) {
    return this.prisma.resource.findMany({
      where: {
        ...(query.search
          ? {
              OR: [
                { title: { contains: query.search, mode: "insensitive" } },
                { description: { contains: query.search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(query.type ? { type: query.type } : {}),
        ...(query.category ? { category: query.category } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.courseId ? { courseId: query.courseId } : {}),
        ...(query.topicId ? { topicId: query.topicId } : {}),
        ...(query.authorProfileId ? { authorProfileId: query.authorProfileId } : {}),
        ...(query.publishedOnly ? { status: ResourceStatus.PUBLISHED } : {}),
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        author: true,
        authorProfile: true,
        course: true,
        topic: true,
      },
    });
  }

  async findCatalog(kind: CatalogKind, subject?: string) {
    const mapping: Record<CatalogKind, { type: ResourceType; category?: ResourceCategory }> = {
      videos: { type: ResourceType.VIDEO },
      documentos: { type: ResourceType.PDF, category: ResourceCategory.DOCUMENT },
      libros: { type: ResourceType.PDF, category: ResourceCategory.BOOK },
      cartillas: { type: ResourceType.PDF, category: ResourceCategory.BOOKLET },
    };

    const selected = mapping[kind];

    return this.prisma.resource.findMany({
      where: {
        status: ResourceStatus.PUBLISHED,
        type: selected.type,
        ...(selected.category ? { category: selected.category } : {}),
        ...(subject ? { course: { slug: subject } } : {}),
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        authorProfile: true,
        course: true,
        topic: true,
      },
    });
  }

  async findOne(id: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        author: true,
        authorProfile: true,
        course: true,
        topic: true,
      },
    });

    if (!resource) {
      throw new NotFoundException("Recurso no encontrado.");
    }

    return resource;
  }

  async uploadResourceAsset(file: any, dto: UploadResourceAssetDto) {
    if (!file) {
      throw new NotFoundException("No se recibio ningun archivo para subir.");
    }

    return this.storageService.uploadResourceAsset({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      folder: dto.folder,
    });
  }

  async create(dto: CreateResourceDto) {
    await this.ensureTopicBelongsToCourse(dto.topicId, dto.courseId);

    return this.prisma.resource.create({
      data: {
        title: dto.title.trim(),
        slug: slugify(dto.slug?.trim() || dto.title),
        description: dto.description.trim(),
        type: dto.type,
        category: this.normalizeCategory(dto.type, dto.category),
        status: dto.status ?? ResourceStatus.DRAFT,
        storageUrl: dto.storageUrl.trim(),
        storageBucket: dto.storageBucket?.trim() || null,
        storagePath: dto.storagePath?.trim() || null,
        originalFileName: dto.originalFileName?.trim() || null,
        mimeType: dto.mimeType?.trim() || null,
        thumbnailUrl: dto.thumbnailUrl?.trim() || null,
        durationMinutes: dto.type === ResourceType.VIDEO ? dto.durationMinutes ?? null : null,
        fileSizeMb: dto.type === ResourceType.PDF ? dto.fileSizeMb ?? null : null,
        publishedAt: dto.status === ResourceStatus.PUBLISHED ? new Date() : null,
        authorId: await this.resolveTeacherAuthorId(dto.authorId),
        authorProfileId: dto.authorProfileId || null,
        courseId: dto.courseId,
        topicId: dto.topicId,
      },
      include: {
        author: true,
        authorProfile: true,
        course: true,
        topic: true,
      },
    });
  }

  async update(id: string, dto: UpdateResourceDto) {
    const existing = await this.findOne(id);

    if (dto.courseId || dto.topicId) {
      await this.ensureTopicBelongsToCourse(dto.topicId ?? existing.topicId, dto.courseId ?? existing.courseId);
    }

    const nextStatus = dto.status ?? existing.status;
    const nextType = dto.type ?? existing.type;
    const nextCategory = this.normalizeCategory(nextType, dto.category ?? existing.category);
    const shouldReplaceStoredFile =
      (dto.storagePath && dto.storagePath !== existing.storagePath) ||
      (dto.storageBucket && dto.storageBucket !== existing.storageBucket);

    if (shouldReplaceStoredFile) {
      await this.storageService.removeResourceAsset(existing.storageBucket, existing.storagePath);
    }

    return this.prisma.resource.update({
      where: { id },
      data: {
        ...(dto.title ? { title: dto.title.trim() } : {}),
        ...(dto.slug ? { slug: slugify(dto.slug) } : {}),
        ...(dto.description ? { description: dto.description.trim() } : {}),
        ...(dto.type ? { type: dto.type } : {}),
        category: nextCategory,
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.storageUrl ? { storageUrl: dto.storageUrl.trim() } : {}),
        ...(dto.storageBucket !== undefined ? { storageBucket: dto.storageBucket?.trim() || null } : {}),
        ...(dto.storagePath !== undefined ? { storagePath: dto.storagePath?.trim() || null } : {}),
        ...(dto.originalFileName !== undefined ? { originalFileName: dto.originalFileName?.trim() || null } : {}),
        ...(dto.mimeType !== undefined ? { mimeType: dto.mimeType?.trim() || null } : {}),
        ...(dto.thumbnailUrl !== undefined ? { thumbnailUrl: dto.thumbnailUrl.trim() || null } : {}),
        ...(dto.durationMinutes !== undefined
          ? { durationMinutes: nextType === ResourceType.VIDEO ? dto.durationMinutes : null }
          : {}),
        ...(dto.fileSizeMb !== undefined
          ? { fileSizeMb: nextType === ResourceType.PDF ? dto.fileSizeMb : null }
          : {}),
        publishedAt: nextStatus === ResourceStatus.PUBLISHED ? existing.publishedAt ?? new Date() : null,
        ...(dto.authorId ? { authorId: await this.resolveTeacherAuthorId(dto.authorId) } : {}),
        ...(dto.authorProfileId !== undefined ? { authorProfileId: dto.authorProfileId || null } : {}),
        ...(dto.courseId ? { courseId: dto.courseId } : {}),
        ...(dto.topicId ? { topicId: dto.topicId } : {}),
      },
      include: {
        author: true,
        authorProfile: true,
        course: true,
        topic: true,
      },
    });
  }

  async remove(id: string) {
    const resource = await this.findOne(id);

    await this.storageService.removeResourceAsset(resource.storageBucket, resource.storagePath);

    return this.prisma.resource.delete({
      where: { id },
    });
  }

  private normalizeCategory(type: ResourceType, category: ResourceCategory) {
    if (type === ResourceType.VIDEO) {
      return ResourceCategory.VIDEO;
    }

    return category === ResourceCategory.VIDEO ? ResourceCategory.DOCUMENT : category;
  }

  private async ensureTopicBelongsToCourse(topicId: string, courseId: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      select: { courseId: true },
    });

    if (!topic || topic.courseId !== courseId) {
      throw new NotFoundException("El tema seleccionado no pertenece a la asignatura.");
    }
  }

  private async resolveTeacherAuthorId(authorId?: string) {
    if (authorId) {
      return authorId;
    }

    const teacherEmail = process.env.TEACHER_EMAIL ?? "laura.mendoza@universidad.edu";
    const teacherName = process.env.TEACHER_NAME ?? "Dra. Laura Mendoza";

    const teacher = await this.prisma.user.upsert({
      where: { email: teacherEmail },
      create: {
        email: teacherEmail,
        name: teacherName,
        role: UserRole.TEACHER,
      },
      update: {
        name: teacherName,
        role: UserRole.TEACHER,
      },
      select: { id: true },
    });

    return teacher.id;
  }
}
