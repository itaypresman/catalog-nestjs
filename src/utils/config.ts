import { config } from 'dotenv';
config();


const env: NodeJS.ProcessEnv = process.env;
type MongoConnection = {
  url: string,
  db: string,
};

export const port: number = +env.PORT || 3000;
export const mongo: MongoConnection = {
  url: env.MONGO_URI,
  db: env.MONGO_DB,
};
