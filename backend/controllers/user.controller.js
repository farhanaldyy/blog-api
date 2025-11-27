import { User } from '../models/user.model.js';

// Create
// export const createUser = async (req, res) => {
//    try {
//       const doc = await User.create(req.body);
//       res.json(doc);
//    } catch (error) {
//       res.status(400).json({ error: error.message });
//    }
// };

// Read All
export const readUsers = async (req, res) => {
   const data = await User.find();
   res.json(data);
};

// Read One
export const readUserById = async (req, res) => {
   const data = await User.findById(req.params.id);
   res.json(data);
};

// Update
export const updateUser = async (req, res) => {
   const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
   res.json(updated);
};

// Delete
export const deletedUser = async (req, res) => {
   await User.findByIdAndDelete(req.params.id);
   res.json({ message: 'User deleted' });
};
