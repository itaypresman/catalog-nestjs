import { config } from 'dotenv';
config();


const env: NodeJS.ProcessEnv = process.env;
type MongoConnection = {
  url: string,
  db: string,
};

type JwtSecret = {
  refresh: string,
  access: string,
};

export const port: number = +env.PORT || 3000;
export const mongo: MongoConnection = {
  url: env.MONGO_URI,
  db: env.MONGO_DB,
};

export const jwtSecret: JwtSecret = {
  refresh: env.JWT_REFRESH_TOKEN,
  access: env.JWT_ACCESS_TOKEN,
};

export const corsOrigin: string = env.CORS_ORIGIN;
