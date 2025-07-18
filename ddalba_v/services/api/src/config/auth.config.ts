import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'hoops-platform-secret-key',
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'hoops-platform-refresh-secret',
  jwtRefreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME || '7d',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
})); 