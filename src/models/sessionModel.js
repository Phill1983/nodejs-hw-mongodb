import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const sessionSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenValidUntil: {
    type: Date,
    required: true,
  },
  refreshTokenValidUntil: {
    type: Date,
    required: true,
  },
});

const Session = model('Session', sessionSchema);

export default Session;
