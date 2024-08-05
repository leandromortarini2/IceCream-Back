import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/createUser.dto';
import { loginUserDto } from './dto/loginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: createUserDto) {
    return this.authService.createUser(user);
  }

  @Post('login')
  signIn(@Body() login: loginUserDto) {
    return this.authService.signIn(login);
  }
}
