import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      password: { type: String, required: true, minlength: 6 },
      role: { type: String, required: true },
   },
   {
      timestamps: true,
   }
);

// Hardening: prevent duplicates walapun email kosong
// UserSchema.index({ email: 1 }, { unique: true, sparse: true });

// Auto-Hash password sebelum save
UserSchema.pre('save', async function () {
   if (!this.isModified('password')) return;

   try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
   } catch (err) {
      next(err);
   }
});

// Compare password
UserSchema.methods.matchPassword = function (plainPwd) {
   return bcrypt.compare(plainPwd, this.password);
};

export const User = mongoose.model('User', UserSchema);
