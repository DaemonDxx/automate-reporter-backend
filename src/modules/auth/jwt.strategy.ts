import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from '../../typings/modules/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      //Todo Добавить файл загрузку из концигов
      secretOrKey: process.env.JWT_KEY || '1',
    });
  }

  async validate(payload: JWTPayload) {
    //TODO Сделать проверку на время жизни токена
    return payload.user;
  }
}
