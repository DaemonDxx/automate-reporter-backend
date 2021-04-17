import { Roles } from '../../../typings/modules/auth/user';

export const REGISTRATION_KEYS = {
  [process.env.REG_KEY_VIEWER || 'VIEWER']: Roles.VIEWER,
  [process.env.REG_KEY_MODERATOR || 'MODERATOR']: Roles.MODERATOR,
  [process.env.REG_KEY_CREATOR || 'CREATOR']: Roles.CREATOR,
};
