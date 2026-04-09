import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT

  app.setGlobalPrefix('api/v1');
  await app.listen(PORT ?? 3000);
  console.log(`App listening at port : ${PORT} 🚀`)
}
bootstrap();
