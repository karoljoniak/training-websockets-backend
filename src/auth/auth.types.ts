import type { CookieOptions } from 'express';

export type AuthUser = { id: string; email: string };
export type AuthSessionPayload = {
  accessToken: string;
  cookieOptions: CookieOptions;
  user: AuthUser;
};
