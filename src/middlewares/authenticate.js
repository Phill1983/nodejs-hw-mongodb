import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import HttpError from '../utils/HttpError.js';
import Session from '../models/sessionModel.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw HttpError(401, 'No token provided');
    }

    const payload = jwt.verify(token, JWT_ACCESS_SECRET);

    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      throw HttpError(401, 'Invalid session');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw HttpError(401, 'Access token expired');
    }

    req.user = { _id: payload.userId };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(HttpError(401, 'Access token expired'));
    } else {
      next(HttpError(401, 'Not authorized'));
    }
  }
};

export default authenticate;
