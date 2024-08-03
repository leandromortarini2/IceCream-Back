import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: createUserDto) {
    {
      const existEmail = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (existEmail) throw new ConflictException('Email already exists');
      const existUsername = await this.userRepository.findOne({
        where: { username: user.username },
      });
      if (existUsername) throw new ConflictException('Username already exists');

      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    }
  }
}
