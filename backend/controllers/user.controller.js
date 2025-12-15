// function user() {
//    // import { User } from '../models/user.model.js';
//    // Create
//    // export const createUser = async (req, res) => {
//    //    try {
//    //       const doc = await User.create(req.body);
//    //       res.json(doc);
//    //    } catch (error) {
//    //       res.status(400).json({ error: error.message });
//    //    }
//    // };
//    // Read All
//    // export const readUsers = async (req, res) => {
//    //    const data = await User.find();
//    //    res.json(data);
//    // };
//    // Read One
//    // export const readUserById = async (req, res) => {
//    //    const data = await User.findById(req.params.id);
//    //    res.json(data);
//    // };
//    // Update
//    // export const updateUser = async (req, res) => {
//    //    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//    //    res.json(updated);
//    // };
//    // Delete
//    // export const deletedUser = async (req, res) => {
//    //    await User.findByIdAndDelete(req.params.id);
//    //    res.json({ message: 'User deleted' });
//    // };
// }

import { Profile } from '../models/userProfile.model.js';

// add profile
export const addProfile = async (req, res, next) => {
   try {
      const { fullname, phone, address, bio, birthday } = req.body;

      // const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const avatarUrl = '/uploads/avatar.jpg'; // dummy url

      const profile = await Profile.create({
         userId: req.user.id,
         fullname,
         avatar: avatarUrl,
         phone,
         address,
         bio,
         birthday,
      });

      res.status(201).json({
         message: 'Profile added success',
         profile: {
            id: profile.userId,
            fullname: profile.fullname,
            bio: profile.bio,
         },
      });
   } catch (err) {
      next(err);
   }
};

// next coding edit profile, add profile must be place in login controller after user login add automaticly create profile

export const editProfile = async (req, res, next) => {
   try {
      const { fullname, phone, address, bio, birthday } = req.body;
      const update = {};

      if (fullname) update.fullname = fullname;
      if (phone) update.phone = phones;
      if (address) update.address = address;
      if (bio) update.bio = bio;
      if (birthday) update.birthday = birthday;

      const edit = await Profile.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!edit) return res.status(404).json({ message: 'Data not found' });
      res.json(edit);
   } catch (err) {
      next(err);
   }
};
