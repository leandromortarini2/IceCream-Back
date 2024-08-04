import { Injectable } from '@nestjs/common';
import { UserService } from '../Users/user.service';
import { loginUserDto } from './dto/loginUser.dto';
import { createUserDto } from './dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signIn(login: loginUserDto) {
    return await this.userService.loginUser(login);
  }

  async createUser(user: createUserDto) {
    return await this.userService.createUser(user);
  }
}
