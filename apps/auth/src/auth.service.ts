import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();

    const jwtExpiration = this.configService.get<number>('JWT_EXPIRATION');

    if (!jwtExpiration) {
      throw new Error('JWT_EXPIRATION is not set');
    }

    expires.setSeconds(expires.getSeconds() + jwtExpiration);

    const token = await this.jwtService.signAsync(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
      // sameSite: 'lax',
    });
  }
}
