import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { FindTopicsQueryDto } from "./dto/find-topics-query.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { TopicsService } from "./topics.service";

@Controller("topics")
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  findAll(@Query() query: FindTopicsQueryDto) {
    return this.topicsService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.topicsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTopicDto) {
    return this.topicsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateTopicDto) {
    return this.topicsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.topicsService.remove(id);
  }
}
