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

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Debe iniciar sesion');
    }
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer') {
      throw new UnauthorizedException('Bearer token requerido');
    }

    if (!token) {
      throw new UnauthorizedException('Token requerido');
    }

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
