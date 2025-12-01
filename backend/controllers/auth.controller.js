import { User } from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';
import { RefreshToken } from '../models/refreshToken.model.js';
import { createJti, signAccessToken, signRefreshToken, persistRefreshToken, setRefreshCookie, hashToken, rotateRefreshToken } from '../utils/tokens.js';

// Register
export const register = async (req, res) => {
   try {
      const { name, email, password, role } = req.body;

      // Prevent duplicate email
      const userExists = await User.findOne({ email });
      if (userExists) {
         return res.status(400).json({ message: 'Email is already registered' });
      }

      const user = await User.create({ name, email, password, role });

      res.status(201).json({
         message: 'User created successfully',
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
         },
         token: generateToken(user._id),
      });
   } catch (error) {
      res.status(500).json({ message: 'Server error ', error: error.message });
   }
};

// Login
export const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials, email not found' });

      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials, password incorrect' });

      const accessToken = signAccessToken(user);
      const jti = createJti();
      const refreshToken = signRefreshToken(user, jti);

      await persistRefreshToken({
         user,
         refreshToken,
         jti,
         ip: req.ip,
         userAgent: req.headers['user-agent'] || '',
      });

      setRefreshCookie(res, refreshToken);

      res.status(200).json({
         message: 'Login successfully',
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
         },
         // token: generateToken(user._id),
         accessToken,
      });
   } catch (error) {
      res.status(500).json({ message: 'Server error ', error: error.message });
   }
};

// Profile
export const profile = async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select('-password');

      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ user });
   } catch (error) {
      res.status(500).json({ message: 'Server error ', error: error.message });
   }
};

// Refresh Token
export const refresh = async (req, res) => {
   try {
      const token = req.cookies?.refresh_token;
      if (!token) return res.status(401).json({ message: 'No refresh token' });

      let decode;
      try {
         decode = jwt.verfy(token, process.env.REFRESH_TOKEN_SECRET);
      } catch (error) {
         return res.status(401).json({ message: 'Invalid or expired refresh token' });
      }

      const tokenHash = hashToken(token);
      const doc = await RefreshToken.findOne({ tokenHash, jti: decode.jti }).populate('user');

      if (!doc) {
         return res.status(401).json({ message: 'Refresh token not recognized' });
      }
      if (doc.revokedAt) {
         return res.status(401).json({ message: 'Refresh token revoked' });
      }
      if (doc.expiresAt < new Date()) {
         return res.status(401).json({ message: 'Refresh token expired' });
      }

      const result = await rotateRefreshToken(doc, doc.user, req, res);
      return res.json({ accessToken: result.accessToken });
   } catch (error) {
      return res.status(500).json({ message: 'Server error ', error: error.message });
   }
};
