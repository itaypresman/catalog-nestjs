import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { port } from './utils/config';
import { mongoConnect } from './utils/mongo';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  await mongoConnect();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  await app.listen(port);
}

bootstrap();
