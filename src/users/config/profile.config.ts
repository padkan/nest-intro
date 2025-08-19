import { ConfigType, registerAs } from '@nestjs/config';

const profileConfig = registerAs('profileConfig', () => ({
  apiKey: process.env.PROFILE_API_KEY || 'defaultApiKey',
}));
export default profileConfig;

export type ProfileConfigType = ConfigType<typeof profileConfig>;
