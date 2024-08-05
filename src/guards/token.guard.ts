import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    const token = request.headers['authorization']?.split(' ')[1] ?? '';

    if (!token) throw new UnauthorizedException('Token Requerido');

    try {
      const secret = process.env.JWT_SECRET;

      const payload = this.jwtService.verify(token, { secret });
      payload.iat = new Date(payload.iat * 1000);
      payload.exp = new Date(payload.exp * 1000);
      request.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalido' + error.message);
    }
  }
}
