import { IsOptional, IsString } from "class-validator";

export class FindAuthorsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
