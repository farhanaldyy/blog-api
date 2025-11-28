// source : https://www.freecodecamp.org/news/how-to-build-a-secure-authentication-system-with-jwt-and-refresh-tokens/

import mongoose from 'mongoose';

const refreshTokenShema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
   },
   tokenHash: {
      type: String,
      required: true,
      unique: true,
   },
   jti: {
      type: String,
      required: true,
      index: true,
   },
   expiresAt: {
      type: Date,
      required: true,
      index: true,
   },
   revokedAt: {
      type: Date,
      default: null,
   },
   replacedBy: {
      type: String,
      default: null,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   ip: String,
   userAgent: String,
});

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenShema);
