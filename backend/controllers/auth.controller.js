import { User } from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';

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
      res.status(500).json({ message: 'Server error', error: error.message });
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

      res.status(200).json({
         message: 'Login successfully',
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
         },
         token: generateToken(user._id),
      });
   } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
   }
};

// Profile
export const profile = async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select('-password');

      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ user });
   } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
   }
};
