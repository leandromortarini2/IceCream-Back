import { Module } from '@nestjs/common';
import { FlavourService } from './flavour.service';
import { FlavourController } from './flavour.controller';

@Module({
  controllers: [FlavourController],
  providers: [FlavourService],
})
export class FlavourModule {}
