import { TEMP_UPLOAD_DIR } from './constants/index.js';
import { initMobgoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';

const bootstrap = async () => {
  await initMobgoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  setupServer();
};
bootstrap();