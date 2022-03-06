import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { logIO } from './logger/logger.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @logIO()
  getHealth(): string {
    return this.appService.getHealth();
  }
}
