import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";

@ApiTags("health")
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  // Liveness probe — Render / Fly / Railway hit this on a schedule.
  // Plain GET / so it works even if api/v1 prefix changes.
  @Get("/")
  @ApiOperation({ summary: "Liveness probe" })
  root() {
    return {
      service: "adverse-live-api",
      status: "ok",
      version: process.env.APP_VERSION || "1.0.0",
      uptime: process.uptime(),
      now: new Date().toISOString(),
    };
  }

  @Get("/health")
  @ApiOperation({ summary: "Liveness probe" })
  health() {
    return { status: "ok", uptime: process.uptime() };
  }

  // Readiness probe: also pings the database. Use this in your hosting
  // dashboard's health check to take the service out of the load balancer
  // when the DB is unreachable.
  @Get("/ready")
  @ApiOperation({ summary: "Readiness probe (checks DB connectivity)" })
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok", db: "up" };
    } catch (e) {
      return {
        status: "degraded",
        db: "down",
        error: (e as Error).message,
      };
    }
  }
}
