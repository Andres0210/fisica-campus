import { Injectable, NotFoundException } from "@nestjs/common";
import { slugify } from "../common/slug.util";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { FindTopicsQueryDto } from "./dto/find-topics-query.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: FindTopicsQueryDto) {
    return this.prisma.topic.findMany({
      where: query.courseId ? { courseId: query.courseId } : undefined,
      orderBy: [{ course: { title: "asc" } }, { position: "asc" }],
      include: {
        course: true,
        _count: {
          select: {
            resources: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
      include: {
        course: true,
        resources: {
          include: {
            authorProfile: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException("Tema no encontrado.");
    }

    return topic;
  }

  create(dto: CreateTopicDto) {
    return this.prisma.topic.create({
      data: {
        title: dto.title.trim(),
        slug: slugify(dto.slug?.trim() || dto.title),
        description: dto.description.trim(),
        position: dto.position,
        courseId: dto.courseId,
      },
    });
  }

  async update(id: string, dto: UpdateTopicDto) {
    await this.findOne(id);

    return this.prisma.topic.update({
      where: { id },
      data: {
        ...(dto.title ? { title: dto.title.trim() } : {}),
        ...(dto.slug ? { slug: slugify(dto.slug) } : {}),
        ...(dto.description ? { description: dto.description.trim() } : {}),
        ...(dto.position !== undefined ? { position: dto.position } : {}),
        ...(dto.courseId ? { courseId: dto.courseId } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.topic.delete({
      where: { id },
    });
  }
}
