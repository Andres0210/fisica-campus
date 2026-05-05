import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthorsModule } from "./authors/authors.module";
import { CoursesModule } from "./courses/courses.module";
import { HealthController } from "./health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { ResourcesModule } from "./resources/resources.module";
import { StorageModule } from "./storage/storage.module";
import { TopicsModule } from "./topics/topics.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../.env", "./.env"],
    }),
    PrismaModule,
    StorageModule,
    AuthorsModule,
    CoursesModule,
    TopicsModule,
    ResourcesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
