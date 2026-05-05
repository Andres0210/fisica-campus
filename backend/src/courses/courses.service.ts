import { Injectable, NotFoundException } from "@nestjs/common";
import { CourseLevel } from "@prisma/client";
import { slugify } from "../common/slug.util";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.course.findMany({
      orderBy: { title: "asc" },
      include: {
        _count: {
          select: {
            topics: true,
            resources: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        topics: {
          orderBy: { position: "asc" },
        },
        resources: {
          orderBy: { createdAt: "desc" },
          include: {
            topic: true,
            authorProfile: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException("Asignatura no encontrada.");
    }

    return course;
  }

  create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        title: dto.title.trim(),
        slug: slugify(dto.slug?.trim() || dto.title),
        description: dto.description.trim(),
        level: dto.level ?? CourseLevel.BASIC,
        isPublished: dto.isPublished ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.findOne(id);

    return this.prisma.course.update({
      where: { id },
      data: {
        ...(dto.title ? { title: dto.title.trim() } : {}),
        ...(dto.slug ? { slug: slugify(dto.slug) } : {}),
        ...(dto.description ? { description: dto.description.trim() } : {}),
        ...(dto.level ? { level: dto.level } : {}),
        ...(dto.isPublished !== undefined ? { isPublished: dto.isPublished } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.course.delete({
      where: { id },
    });
  }
}
