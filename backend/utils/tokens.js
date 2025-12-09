import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { RefreshToken } from '../models/refreshToken.model.js';

const ACCESS_TTL = '15m';
const REFRESH_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

export const hashToken = (token) => {
   return crypto.createHash('sha256').update(token).digest('hex');
};

export const createJti = () => crypto.randomBytes(16).toString('hex');

export const signAccessToken = (user) => {
   const payload = { id: user._id.toString(), email: user.email, role: user.role };
   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_TTL });
};

export const signRefreshToken = (user, jti) => {
   const payload = { id: user._id.toString(), jti };
   return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TTL_SEC,
   });
};

export const persistRefreshToken = async ({ user, refreshToken, jti, ip, userAgent }) => {
   const tokenHash = hashToken(refreshToken);

   await RefreshToken.create({
      user: user._id,
      tokenHash,
      jti,
      ip,
      userAgent,
      expiresAt: new Date(Date.now() + REFRESH_TTL_SEC * 1000),
   });
};

export const setRefreshCookie = (req, res, token) => {
   const isProd = process.env.NODE_ENV === 'production';

   res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: isProd ? true : false,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: REFRESH_TTL_SEC * 1000,
      path: '/', // for postman
   });
};

export const rotateRefreshToken = async (oldDoc, user, req, res) => {
   oldDoc.revokedAt = new Date();
   const newJti = createJti();
   oldDoc.replacedBy = newJti;
   await oldDoc.save();

   const newAccess = signAccessToken(user);
   const newRefresh = signRefreshToken(user, newJti);

   await persistRefreshToken({
      user,
      refreshToken: newRefresh,
      jti: newJti,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || '',
   });

   // FIX: missing req arg previously
   setRefreshCookie(req, res, newRefresh);

   return { accessToken: newAccess };
};
