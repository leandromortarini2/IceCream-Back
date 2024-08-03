import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/createUser.dto';
import { loginUserDto } from './dto/loginUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: createUserDto) {
    return this.userService.createUser(user);
  }

  @Post('login')
  signIn(@Body() login: loginUserDto) {
    return this.userService.loginUser(login);
  }
}
