import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.errors({
              stack: true,
            }),
            winston.format.timestamp(),
            utilities.format.nestLike(),
          ),
        }),
      ],
    }),
  });
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('BRS API')
    .setDescription('API для приложения "Балансы"')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT_APP ?? 3000);
}
bootstrap();
