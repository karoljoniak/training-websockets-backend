const ONE_DAY = 24 * 60 * 60 * 1000;

/** maxAge ciasteczka (ms), zgodne z JWT_EXPIRES_IN / JWT_EXPIRES_REMEMBER */
export const COOKIE_EXPIRY = {
  DEFAULT: 7 * ONE_DAY,
  REMEMBER: 30 * ONE_DAY,
} as const;
