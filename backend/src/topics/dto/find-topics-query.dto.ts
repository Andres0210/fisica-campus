import { IsOptional, IsString } from "class-validator";

export class FindTopicsQueryDto {
  @IsOptional()
  @IsString()
  courseId?: string;
}
