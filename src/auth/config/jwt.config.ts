import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default_secret',
  audience: process.env.JWT_TOKEN_AUDIENCE || 'nestjs-intro',
  issuer: process.env.JWT_TOKEN_ISSUER || 'nestjs-intro',
  accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600', 10),
}));
