import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { createUserDto } from '../Auth/dto/createUser.dto';
import { loginUserDto } from '../Auth/dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(login: loginUserDto) {
    console.log(login.userId);
    let user: User;
    const clientList = await clerk.users.getUser(login.userId);
    if (!clientList) throw new NotFoundException('User Clerk not found');
    console.log(clientList);
    const { firstName, lastName, emailAddresses } = clientList;
    const userEmail = emailAddresses[0].emailAddress;

    user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    if (!user) {
      const userToSave = {
        name: firstName,
        lastName,
        email: userEmail,
      };

      const newUser = this.userRepository.create(userToSave);
      user = await this.userRepository.save(newUser);
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
    console.log('token', token);
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
