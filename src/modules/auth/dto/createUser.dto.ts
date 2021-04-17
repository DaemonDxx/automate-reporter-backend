import { SecretKey, UserInfo } from '../../../typings/modules/auth/user';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsEnum, Length, Max, Min } from 'class-validator';
import { REGISTRATION_KEYS } from '../utils/regKey.constant';

export class CreateUserDTO implements Omit<UserInfo & SecretKey, 'role'> {
  @IsDefined()
  @Length(4, 16)
  @Transform(({ value }) => {
    return value.toString().trim();
  })
  @ApiProperty({
    description: 'Логин',
    example: 'login_01',
  })
  username: string;

  @IsDefined()
  @ApiProperty({
    example: '12345!22',
  })
  password: string;

  //TODO вынести конфиги в отдельный файл
  @IsDefined()
  @IsEnum(Object.keys(REGISTRATION_KEYS), {
    message: 'Секретный ключи не верный',
  })
  @ApiProperty({
    description:
      'Секретный ключ. От него зависит какими правами будет обладать новый пользователь',
  })
  key: string;
}
