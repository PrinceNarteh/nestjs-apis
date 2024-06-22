import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const chat = app.get(ChatGateway);
  console.log(chat.handleNewMessage('hello'));
  const config = app.get(ConfigService);
  const port = config.get('server.port');
  await app.listen(port);
}
bootstrap();
