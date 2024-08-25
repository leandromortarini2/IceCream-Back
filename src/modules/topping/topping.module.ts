import { Module } from '@nestjs/common';
import { ToppingService } from './topping.service';
import { ToppingController } from './topping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topping } from './entities/topping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topping])],
  controllers: [ToppingController],
  providers: [ToppingService],
})
export class ToppingModule {}
