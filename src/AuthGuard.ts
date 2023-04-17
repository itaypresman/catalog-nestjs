import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtSecret }  from './utils/config';
import { mongoCollection } from './utils/mongo';
import UserDto from './dto/user.dto';
import userDto from './dto/user.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  private async getUser(email): Promise<UserDto | null> {
    const user = await mongoCollection('users').findOne({ email });

    return user ? new userDto(user) : null;
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const next = context.switchToHttp().getNext();
    const accessToken: string = this.extractTokenFromHeader(request);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const { email }: { email: string } = await jwt.verify(accessToken, jwtSecret.access);
      const user: UserDto = await this.getUser(email);

      if (!user) {
        next(new UnauthorizedException());
      }

      request['user'] = user;
    } catch (err) {
      throw new UnauthorizedException(err.name);
    }

    return true;
  }

  private extractTokenFromHeader(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
