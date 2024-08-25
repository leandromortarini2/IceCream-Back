import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { Repository } from 'typeorm';
import { loginUserDto } from '../Auth/dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(login: loginUserDto) {
    let user: User;
    const clientList = await clerk.users.getUser(login.userId);
    if (!clientList) throw new NotFoundException('Usuario Clerk no encontrado')
    const { firstName, lastName, emailAddresses } = clientList;
    const userEmail = emailAddresses[0].emailAddress;

    if (userEmail !== process.env.EMAIL_ADMIN) throw new UnauthorizedException('No tienes permisos para ingresar al sitio');

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
      name,
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
        name,
        email,
        validate,
        role,
        lastLogin,
      },
    };
  }
}
