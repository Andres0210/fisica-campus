import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  check() {
    return {
      status: "ok",
      service: "fisica-campus-backend",
      timestamp: new Date().toISOString(),
    };
  }
}
