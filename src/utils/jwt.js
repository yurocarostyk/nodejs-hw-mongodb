import jwt from 'jsonwebtoken';
import { env } from './env.js';

const jwtSecret = env('JWT_SECRET');

export const generateResetToken = (payload) =>
  jwt.sign(
    {
      sub: payload._id,
      email: payload.email,
    },
    jwtSecret,
    {
      expiresIn: '5m',
    },
  );

export const verifyJwtToken = (token) => {
  try {
    const payload = jwt.verify(token, env('JWT_SECRET'));
    return { data: payload };
  } catch (error) {
    return { error };
  }
};