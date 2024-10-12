import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import UsersCollection from '../db/models/User.js';
import SessionsCollection from '../db/models/Session.js';

import {
  FIFTEEN_MINUTES,
  SMTP,
  TEMPLATES_DIR,
  THIRTY_DAYS,
} from '../constants/index.js';

import { env } from '../utils/env.js';
import { sendMail } from '../utils/sendMail.js';
import { generateResetToken, verifyJwtToken } from '../utils/jwt.js';

const generateTokens = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + THIRTY_DAYS);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const registerUser = async (userData) => {
  const user = await UsersCollection.findOne({ email: userData.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  return await UsersCollection.create({
    ...userData,
    password: encryptedPassword,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect.');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Email or password is incorrect.');
  }

  await SessionsCollection.deleteOne({ userId: user.id });

  const tokens = generateTokens();

  const newSession = await SessionsCollection.create({
    userId: user._id,
    ...tokens,
  });

  return newSession;
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired = new Date() > oldSession.refreshToken;
  if (isRefreshTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionsCollection.deleteOne({
    sessionId,
    refreshToken,
  });

  const tokens = generateTokens();

  const newSession = await SessionsCollection.create({
    userId: oldSession.userId,
    ...tokens,
  });

  return newSession;
};

export const logOutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async ({ email }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = generateResetToken(user);

  const resetPasswordTemplate = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (await fs.readFile(resetPasswordTemplate)).toString();
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

//   try {
//      await sendMail({
//       from: env(SMTP.SMTP_FROM),
//        to: email,
//       subject: 'Reset your password',
//        html,    });
//   } catch (e) {
//    console.log('requestResetToken ~ e:', e);
//  throw createHttpError(
//       500,       'Failed to send the email, please try again later.',
//      );
//   }
//  };
await sendEmail({
  from: env(SMTP.SMTP_FROM),
  to: email,
  subject: 'Reset your password',
  html,
});
};



export const resetPassword = async (payload) => {
  const { data, error } = verifyJwtToken(payload.token);

  if (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UsersCollection.findOne({
    email: data.email,
    _id: data.sub,
  });
  if (!user) throw createHttpError(404, 'User not found');

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: hashedPassword },
  );

  await SessionsCollection.findOneAndDelete({
    userId: user._id,
  });
};