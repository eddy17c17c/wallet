import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            format: winston.format.json(),
            transports: [
                new winston.transports.Console({}),
            ],
        }),
    });
    
    await app.listen(3000);
}
bootstrap();
