import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger, RequestMethod } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  // Trust the first proxy (Render / Fly / Railway / Vercel-like setups
  // place us behind a load balancer; we need real client IPs for rate
  // limiting and audit logs).
  const expressInstance = app.getHttpAdapter().getInstance() as {
    set?: (key: string, value: unknown) => void;
  };
  expressInstance.set?.("trust proxy", 1);

  // Helmet: keep CSP off because Swagger UI uses inline scripts and an
  // API doesn't render user content. crossOriginResourcePolicy is loosened
  // so the frontend (different origin) can fetch images / assets.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // CORS: allow the configured frontend origin(s). In production set
  // CORS_ORIGINS as a comma-separated list (e.g.
  // "https://adverse.live,https://www.adverse.live"). In development we
  // allow localhost on common dev ports.
  const isProd = process.env.NODE_ENV === "production";
  const envOrigins = (process.env.CORS_ORIGINS || process.env.APP_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const devOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
  ];
  const allowed = new Set([...(envOrigins.length ? envOrigins : []), ...(isProd ? [] : devOrigins)]);

  app.enableCors({
    origin: (origin, cb) => {
      // Same-origin / curl / server-to-server have no Origin header — allow.
      if (!origin) return cb(null, true);
      if (allowed.has(origin)) return cb(null, true);
      // Wildcard subdomain support: if any allowed entry starts with
      // `https://*.example.com`, match the suffix.
      for (const a of allowed) {
        if (a.startsWith("https://*.") && origin.endsWith(a.slice(9))) {
          return cb(null, true);
        }
      }
      return cb(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });

  app.setGlobalPrefix("api/v1", {
    // Keep `/`, `/health`, `/ready` reachable without the prefix so Render
    // and uptime monitors can hit them directly.
    exclude: [
      { path: "/", method: RequestMethod.GET },
      { path: "health", method: RequestMethod.GET },
      { path: "ready", method: RequestMethod.GET },
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger only in non-production by default; flip with ENABLE_SWAGGER=1
  // if you want to expose docs in prod (e.g. Render free tier).
  if (!isProd || process.env.ENABLE_SWAGGER === "1") {
    const config = new DocumentBuilder()
      .setTitle("AdVerse Live API")
      .setDescription("Earning + voice rooms platform — REST + WebSockets")
      .setVersion("1.0")
      .addBearerAuth()
      .addTag("auth")
      .addTag("users")
      .addTag("wallet")
      .addTag("quiz")
      .addTag("referrals")
      .addTag("voice-rooms")
      .addTag("chat")
      .addTag("friends")
      .addTag("deposits")
      .addTag("withdrawals")
      .addTag("notifications")
      .addTag("missions")
      .addTag("community")
      .addTag("admin")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  const port = Number(process.env.PORT) || 4000;
  // Bind to 0.0.0.0 so Render / Fly / Railway can route traffic to us.
  await app.listen(port, "0.0.0.0");
  Logger.log(`AdVerse Live API ready on :${port} (NODE_ENV=${process.env.NODE_ENV || "development"})`, "Bootstrap");
  if (!isProd || process.env.ENABLE_SWAGGER === "1") {
    Logger.log(`Swagger docs at /api/docs`, "Bootstrap");
  }
}

bootstrap();
