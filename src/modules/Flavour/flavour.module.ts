import { Module } from '@nestjs/common';
import { FlavourService } from './flavour.service';
import { FlavourController } from './flavour.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flavour } from './entities/flavour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flavour])],
  controllers: [FlavourController],
  providers: [FlavourService],
  exports: [FlavourService],
})
export class FlavourModule {}
