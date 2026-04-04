import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "https://travelshield-admin-2y37.vercel.app/",
      "https://travelshield-admin-b3w6.vercel.app/"
    ],
  });

  await app.listen(3001);
}

bootstrap();