import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendOrigin =
    process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: [frontendOrigin],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT ?? 3000);

  console.log(`App listening at port : ${PORT} 🚀`);
}
void bootstrap();
