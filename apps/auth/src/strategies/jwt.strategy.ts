import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { UsersService } from '../users/users.service';
import { Request } from 'express'; // Import Request type

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request.cookies as Record<string, string> | undefined;
          return (
            cookies?.Authentication ||
            (request as unknown as { Authentication?: string })
              ?.Authentication ||
            (request.headers.authentication as string) ||
            null
          );
        },
      ]),
      secretOrKey: jwtSecret,
    });
  }

  async validate({ userId }: TokenPayload) {
    return await this.usersService.getUser({ _id: userId });
  }
}
