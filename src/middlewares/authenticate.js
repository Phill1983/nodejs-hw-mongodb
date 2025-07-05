import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import Session from '../models/sessionModel.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'No token provided');
    }

    const payload = jwt.verify(token, JWT_ACCESS_SECRET);

    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      throw createHttpError(401, 'Invalid session');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Access token expired');
    }

    req.user = { _id: payload.userId };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Access token expired'));
    } else {
      next(createHttpError(401, 'Not authorized'));
    }
  }
};

export default authenticate;
