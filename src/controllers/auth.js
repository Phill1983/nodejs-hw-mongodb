import * as authService from '../services/auth.js';
import HttpError from "../utils/HttpError.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

// контроллер реєстрації
const register = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await authService.registerUser({ name, email, password });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

// контроллер логіну
const login = async (req, res) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken } = await authService.loginUser({ email, password });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken,
    },
  });
};

// контроллер для оновлення сесії
const refresh = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  const { accessToken, refreshToken } = await authService.refreshSession(oldRefreshToken);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

// контроллер для виходу з системи
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await authService.logoutUser(refreshToken);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(204).send();
};

// контроллер надсилання листа для скидання пароля
const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await authService.findUserByEmail(email);
  if (!user) {
    throw HttpError(404, "User not found!");
  }

  const token = authService.createResetToken({ email });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const emailResult = await authService.sendResetEmail({
    to: email,
    resetLink,
  });

  if (!emailResult) {
    throw HttpError(500, "Failed to send the email, please try again later.");
  }

  res.status(200).json({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  });
};

// контроллер зміни пароля після відновлення
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const { email } = await authService.verifyResetToken(token);

  const user = await authService.findUserByEmail(email);
  if (!user) {
    throw HttpError(404, "User not found!");
  }

  await authService.updateUserPassword(user._id, password);

  await authService.deleteUserSession(user._id);

  res.status(200).json({
    status: 200,
    message: "Password has been successfully reset.",
    data: {},
  });
};

// експорт усіх обгорнутих контролерів
export const registerController = ctrlWrapper(register);
export const loginController = ctrlWrapper(login);
export const refreshController = ctrlWrapper(refresh);
export const logoutController = ctrlWrapper(logout);
export const sendResetEmailController = ctrlWrapper(sendResetEmail);
export const resetPasswordController = ctrlWrapper(resetPassword);
