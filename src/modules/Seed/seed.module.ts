import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Flavour } from '../Flavour/entities/flavour.entity';
import { Category } from '../category/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Flavour])],
  providers: [SeedService],
})
export class SeedModule {}
