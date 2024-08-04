import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { createUserDto } from '../Auth/dto/createUser.dto';
import { loginUserDto } from '../Auth/dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(login: loginUserDto) {
    let user;
    if (!login.email && !login.username) {
      throw new UnauthorizedException('Inroducir email o Usuario y Contrasena');
    }

    if (login.email) {
      user = await this.userRepository.findOne({
        where: { email: login.email },
      });
      if (!user) throw new UnauthorizedException('Datos incorrectos');
    }

    if (!user && login.username && login.password) {
      user = await this.userRepository.findOne({
        where: { username: login.username },
      });
      if (!user) throw new UnauthorizedException('Datos incorrectos');
      const checkPassword = await bcrypt.compare(login.password, user.password);
      if (!checkPassword) throw new UnauthorizedException('Datos incorrectos');
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: [user.role],
    };
    const now = new Date();
    await this.userRepository.update(user.id, { lastLogin: now });

    const {
      username,
      name,
      sucursal,
      phone,
      email,
      validate,
      role,
      lastLogin,
    } = user;

    const token = this.jwtService.sign(payload);
    return {
      success: 'Login Existoso',
      token,
      user: {
        username,
        name,
        sucursal,
        phone,
        email,
        validate,
        role,
        lastLogin,
      },
    };
  }

  async createUser(user: createUserDto) {
    {
      const existEmail = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (existEmail) throw new ConflictException('Email duplicado');
      const existUsername = await this.userRepository.findOne({
        where: { username: user.username },
      });
      if (existUsername) throw new ConflictException('Usuario duplicado');

      const hashPassword = await bcrypt.hash(user.password, 10);
      if (!hashPassword)
        throw new BadRequestException('Password could not be hashed');

      const newUser = this.userRepository.create({
        ...user,
        password: hashPassword,
      });

      await this.userRepository.save(newUser);

      return { message: 'Usuario creado correctamente' };
    }
  }
}
