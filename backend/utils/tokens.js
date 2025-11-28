import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { RefreshToken } from '../models/refreshToken.model.js';

const ACCES_TTL = '15m';
const REFRESH_TTL_SEC = 60 * 60 * 24 * 7; // 7 days
