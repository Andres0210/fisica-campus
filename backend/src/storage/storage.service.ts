import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { slugify } from "../common/slug.util";

type UploadFileInput = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  folder?: string;
};

type UploadedAsset = {
  bucket: string;
  path: string;
  publicUrl: string;
  mimeType: string;
  originalFileName: string;
  sizeInBytes: number;
  fileSizeMb: number;
};

@Injectable()
export class StorageService {
  private client: SupabaseClient | null = null;
  private bucketReadyPromise: Promise<void> | null = null;

  private getBucket() {
    return process.env.SUPABASE_STORAGE_BUCKET ?? "fisica-campus-assets";
  }

  private getClient() {
    if (this.client) {
      return this.client;
    }

    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
      throw new InternalServerErrorException(
        "Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en la configuracion del backend.",
      );
    }

    this.client = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    return this.client;
  }

  async uploadResourceAsset(input: UploadFileInput): Promise<UploadedAsset> {
    if (!input.buffer?.length) {
      throw new BadRequestException("No se recibio un archivo valido.");
    }

    const bucket = this.getBucket();
    await this.ensureBucket(bucket);
    const extension = this.getExtension(input.originalName);
    const baseName = slugify(input.originalName.replace(/\.[^/.]+$/, "")) || "archivo";
    const folder = input.folder?.trim() || "resources";
    const timestamp = Date.now();
    const path = `${folder}/${timestamp}-${baseName}.${extension}`;

    const supabase = this.getClient();
    const { data, error } = await supabase.storage.from(bucket).upload(path, input.buffer, {
      contentType: input.mimeType,
      cacheControl: "3600",
      upsert: false,
    });

    if (error || !data) {
      throw new InternalServerErrorException(error?.message ?? "No se pudo subir el archivo a Supabase.");
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      bucket,
      path: data.path,
      publicUrl: publicData.publicUrl,
      mimeType: input.mimeType,
      originalFileName: input.originalName,
      sizeInBytes: input.buffer.byteLength,
      fileSizeMb: Number((input.buffer.byteLength / 1024 / 1024).toFixed(2)),
    };
  }

  async removeResourceAsset(bucket: string | null | undefined, path: string | null | undefined) {
    if (!bucket || !path) {
      return;
    }

    const supabase = this.getClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private getExtension(fileName: string) {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension || "bin";
  }

  private async ensureBucket(bucket: string) {
    if (this.bucketReadyPromise) {
      await this.bucketReadyPromise;
      return;
    }

    this.bucketReadyPromise = this.ensureBucketInternal(bucket);

    try {
      await this.bucketReadyPromise;
    } finally {
      this.bucketReadyPromise = null;
    }
  }

  private async ensureBucketInternal(bucket: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      throw new InternalServerErrorException(
        `No se pudo validar el bucket de Supabase: ${error.message}`,
      );
    }

    const existingBucket = data.find((item) => item.name === bucket);

    if (existingBucket) {
      return;
    }

    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: "250MB",
    });

    if (createError) {
      throw new InternalServerErrorException(
        `El bucket "${bucket}" no existe y no pudo crearse automaticamente: ${createError.message}`,
      );
    }
  }
}
