import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

// auth result from chatgpt
// export const protect = async (req, res, next) => {
//    try {
//       const authHeader = req.headers.authorization || '';
//       // console.log(authHeader);
//       if (!authHeader) return res.status(401).json({ message: 'Access denied' });

//       const token = authHeader.split(' ')[1];
//       // console.log('token: ', token);
//       if (!token) return res.status(401).json({ message: 'Token missing' });

//       jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//          if (err) throw new Error('Verify error & Invalid token');
//          req.user = user;
//          next();
//       });

//       // const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       // req.user = await User.findById(decoded.id).select('-password');
//    } catch (error) {
//       res.status(401).json({ message: error.message });
//    }
// };

export const protect = async (req, res, next) => {
   try {
      const header = req.headers.authorization || '';
      const [scheme, tokenFromHeader] = header.split(' ');
      const tokenFromCookie = req.cookies?.access_token;

      const token = scheme === 'Bearer' && tokenFromHeader ? tokenFromHeader : tokenFromCookie;

      if (!token) return res.status(401).json({ message: 'No token provide' });

      // basics sanity check
      if (token.split('.').length !== 3) return res.status(400).json({ message: 'Malformed token' });

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      // if user (deleted, suspend, role change)
      const user = await User.findById(decode.id).select('name role');

      if (!user) return res.status(401).json({ message: 'User no longer exists' });

      req.user = {
         id: user._id,
         name: user.name,
         role: user.role,
      };
      next();
   } catch (err) {
      // const msg = error.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid Token';
      next(err);
   }
};
