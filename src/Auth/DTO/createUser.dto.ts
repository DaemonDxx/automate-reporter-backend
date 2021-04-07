import { SecretKey, UserInfo } from '../../Typings/Modules/Auth/user';

export class CreateUserDTO implements Omit<UserInfo & SecretKey, 'role'> {
  username: string;
  password: string;
  key: string;
}
