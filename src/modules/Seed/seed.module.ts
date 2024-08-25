import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Flavour } from '../Flavour/entities/flavour.entity';
import { Category } from '../category/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Flavour, User])],
  providers: [SeedService],
})
export class SeedModule {}
