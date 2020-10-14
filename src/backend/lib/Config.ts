import { config } from '../config';

export interface IConfig {
  PORT: number;
  DB_URL: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: number;
  CLOUDINARY_API_SECRET: string;
  GOOGLE_AUTH_CALLBACK_URL: string;
  GOOGLE_AUTH_CLIENT_ID: string;
  GOOGLE_AUTH_CLIENT_SECRET: string;
  GOOGLE_API_KEY: string;
  SESSION_NAME: string;
  SESSION_SECRET: string;
}

class Config {
  configFile: IConfig;

  constructor() {
    this.configFile = config[process.env.NODE_ENV];
  }

  get(key: keyof IConfig): any {
    return this.configFile[key];
  }
}

export default new Config();
