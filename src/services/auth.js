
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../config.js';

const SALT_ROUNDS = 10;


// 🔑 Реєстрація користувача
export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

// 🔑 Логін користувача
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }



  const accessToken = jwt.sign(
    { userId: user._id },
    JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  await Session.findOneAndDelete({ userId: user._id });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

// 🔑 Оновлення сесії
export const refreshSession = async (oldRefreshToken) => {
  const session = await Session.findOne({ refreshToken: oldRefreshToken });

  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token expired');
  }

  const userId = session.userId;

  const accessToken = jwt.sign(
    { userId },
    JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  await Session.findOneAndDelete({ refreshToken: oldRefreshToken });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

// 🔑 Логаут користувача
export const logoutUser = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  await Session.findOneAndDelete({ refreshToken });
};
