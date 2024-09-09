 import mongoose from 'mongoose';

export async function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_DB, MONGODB_HOST } = process.env;

  if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_DB || !MONGODB_HOST) {
    throw new Error('Відсутні змінні середовища для підключення до MongoDB');
  }

  const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}
