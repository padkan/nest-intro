import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  S3_BUCKET: Joi.string().required(),
  PROFILE_API_KEY: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().default('nestjs-intro'),
  JWT_TOKEN_ISSUER: Joi.string().default('nestjs-intro'),
  JWT_TOKEN_EXPIRES_IN: Joi.number().default(3600),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.number().default(86400),
  API_VERSION: Joi.string().required(),
  AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  TELEGRAM_BOT_TOKEN: Joi.string().required(),
  TELEGRAM_CHAT_ID: Joi.string().required(),
  LOG_FILE_NAME: Joi.string().required(),
  LOG_FILE_PATH: Joi.string().required(),
});
