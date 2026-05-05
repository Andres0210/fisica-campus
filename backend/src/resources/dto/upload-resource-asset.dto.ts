import { IsOptional, IsString } from "class-validator";

export class UploadResourceAssetDto {
  @IsOptional()
  @IsString()
  folder?: string;
}
