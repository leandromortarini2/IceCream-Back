import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
