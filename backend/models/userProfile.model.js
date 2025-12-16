import mongose from 'mongoose';

const profileScheme = new mongose.Schema(
   {
      userId: { type: mongose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
      username: { type: mongose.Schema.Types.String, ref: 'User', required: true },
      fullname: { type: String, default: null },
      avatar: { type: String, default: null },
      phone: { type: Number, default: null },
      address: { type: String, default: null },
      bio: { type: String, default: null },
      birthday: { type: Date, default: null },
   },
   {
      timestamps: true,
   }
);

export const Profile = mongose.model('Profile', profileScheme);
