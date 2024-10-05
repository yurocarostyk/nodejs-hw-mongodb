import multer from 'multer';

import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now();
    callback(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split('.').pop();
  if (extension === 'exe') {
    return callback(createHttpError(400, '.exe is not valid file format'));
  }
  callback(null, true);
};

export const uploadPhoto = multer({ storage, limits, fileFilter });