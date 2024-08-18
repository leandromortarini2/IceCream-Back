import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { LoggerGlobal } from './middleware/loggerGlobal.middleware';
import { ValidationPipe } from '@nestjs/common';
import { CacthAllExceptionsFilter } from './utils/CacthAllExceptionsFilter.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new CacthAllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(LoggerGlobal);
  await app.listen(process.env.PORT);
}
bootstrap();
