import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAuthorDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  slug?: string;

  @IsString()
  @MaxLength(120)
  profession!: string;

  @IsString()
  bio!: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
