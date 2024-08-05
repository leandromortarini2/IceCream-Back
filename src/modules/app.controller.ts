import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get()
  pruebaLogger() {
    console.log('Hola logger');
  }
}
