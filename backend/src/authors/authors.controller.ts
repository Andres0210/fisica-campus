import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AuthorsService } from "./authors.service";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { FindAuthorsQueryDto } from "./dto/find-authors-query.dto";
import { UpdateAuthorDto } from "./dto/update-author.dto";

@Controller("authors")
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  findAll(@Query() query: FindAuthorsQueryDto) {
    return this.authorsService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.authorsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAuthorDto) {
    return this.authorsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateAuthorDto) {
    return this.authorsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.authorsService.remove(id);
  }
}
