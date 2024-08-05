import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { LoggerGlobal } from './middleware/loggerGlobal.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.use(LoggerGlobal);
  await app.listen(process.env.PORT);
}
bootstrap();
