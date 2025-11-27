import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const protect = async (req, res, next) => {
   try {
      const authHeader = req.headers.authorization;
      // console.log(authHeader);
      if (!authHeader) return res.status(401).json({ message: 'Access denied' });

      const token = authHeader.split(' ')[1];
      // console.log('token: ', token);
      if (!token) return res.status(401).json({ message: 'Token missing' });

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
         if (err) throw new Error('Verify error');
         req.user = user;
         next();
      });

      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // req.user = await User.findById(decoded.id).select('-password');
   } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
   }
};
