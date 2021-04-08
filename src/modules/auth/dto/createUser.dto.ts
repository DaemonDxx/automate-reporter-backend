import { SecretKey, UserInfo } from '../../../typings/modules/auth/user';

export class CreateUserDTO implements Omit<UserInfo & SecretKey, 'role'> {
  username: string;
  password: string;
  key: string;
}
