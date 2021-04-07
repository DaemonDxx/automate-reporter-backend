import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './Schemas/user.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    //Todo Добавить взятие настроек из конфигов
    JwtModule.register({
      secret: process.env.JWT_KEY || '1',
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([{ schema: UserSchema, name: 'User' }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, Logger, UserService],
  exports: [AuthService],
})
export class AuthModule {}
