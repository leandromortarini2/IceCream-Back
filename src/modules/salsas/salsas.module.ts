import { Module } from '@nestjs/common';
import { SalsasService } from './salsas.service';
import { SalsasController } from './salsas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salsa } from './entities/salsa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salsa])],
  controllers: [SalsasController],
  providers: [SalsasService],
})
export class SalsasModule {}
