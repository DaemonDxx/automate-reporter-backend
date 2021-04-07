import { User } from '../../../Auth/Schemas/user.schema';

export type JWTToken = string;

export type JWTPayload = {
  user: Omit<User, 'password'>;
  iat: number;
  exp: number;
};
