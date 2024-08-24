import { Module } from '@nestjs/common';
import { FlavourModule } from '../Flavour/flavour.module';
import { CategoryModule } from '../category/category.module';
import { SeedService } from './seed.service';

@Module({
  imports: [CategoryModule, FlavourModule],
  controllers: [],
  providers: [SeedService],
  exports: [],
})
export class SeedModule {}
