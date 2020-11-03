import dotenv from 'dotenv';

dotenv.config();

export const __prod__ = process.env.NODE_ENV === 'production';

export const __port__ = process.env.PORT;

export const REDIS_COOKIE_NAME = 'qid';

export const REDIS_PASSWORD_RESET_PREFIX = 'forget-password';

// !--- Generate new mailer at https://ethereal.email/
export const MAILER_USER = process.env.MAILER_USER || 'felicita.christiansen22@ethereal.email';

export const MAILER_PASSWORD = process.env.MAILER_PASSWORD || 'MbzFrs3MjffCWmkeum';

export const { FRONTEND_URL } = process.env;
export const { FRONTEND_RESET_PASSWORD_ROUTE } = process.env;
