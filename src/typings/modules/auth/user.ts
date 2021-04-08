export enum Roles {
  VIEWER = 'VIEWER',
  MODERATOR = 'MODERATOR',
  CREATOR = 'CREATOR',
}

export type SecretKey = {
  key: string;
};

export type UserInfo = {
  username: string;
  password: string;
  role: Roles;
};
