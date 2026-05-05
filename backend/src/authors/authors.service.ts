import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { slugify } from "../common/slug.util";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { FindAuthorsQueryDto } from "./dto/find-authors-query.dto";
import { UpdateAuthorDto } from "./dto/update-author.dto";

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindAuthorsQueryDto) {
    return this.prisma.author.findMany({
      where: query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { profession: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            resources: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        resources: {
          include: {
            course: true,
            topic: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!author) {
      throw new NotFoundException("Autor no encontrado.");
    }

    return author;
  }

  async create(dto: CreateAuthorDto) {
    return this.prisma.author.create({
      data: {
        name: dto.name.trim(),
        slug: slugify(dto.slug?.trim() || dto.name),
        profession: dto.profession.trim(),
        bio: dto.bio.trim(),
        avatarUrl: dto.avatarUrl?.trim() || null,
      },
    });
  }

  async update(id: string, dto: UpdateAuthorDto) {
    await this.findOne(id);

    return this.prisma.author.update({
      where: { id },
      data: {
        ...(dto.name ? { name: dto.name.trim() } : {}),
        ...(dto.slug ? { slug: slugify(dto.slug) } : {}),
        ...(dto.profession ? { profession: dto.profession.trim() } : {}),
        ...(dto.bio ? { bio: dto.bio.trim() } : {}),
        ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl.trim() || null } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.author.delete({
      where: { id },
    });
  }
}
