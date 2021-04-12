import { SecretKey, UserInfo } from '../../../typings/modules/auth/user';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO implements Omit<UserInfo & SecretKey, 'role'> {
  @ApiProperty({
    description: 'Логин',
    example: 'login_01',
  })
  username: string;

  @ApiProperty({

    example: '12345!22',
  })
  password: string;

  @ApiProperty({
    description:
      'Секретный ключ. От него зависит какими правами будет обладать новый пользователь',
  })
  key: string;
}
