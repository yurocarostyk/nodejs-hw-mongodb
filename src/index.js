import dotenv from 'dotenv';
dotenv.config();
import { initMongoConnection } from './db/initMongoDB.js';
import { setupServer } from './server.js';


const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};
bootstrap();
