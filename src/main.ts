import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { port } from './utils/config';
import { mongoConnect } from './utils/mongo';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  await mongoConnect();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(cookieParser());
  await app.listen(port);
}

bootstrap();
