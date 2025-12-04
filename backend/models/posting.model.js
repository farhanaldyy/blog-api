import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
   {
      title: { type: String, required: true, trim: true },
      slug: { type: String, required: true, unique: true, trim: true },
      content: { type: String, required: true },
      excerpt: { type: String, default: '' },
      coverImage: { type: String, default: null },
      authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      tags: { type: [String], default: [] },
      categories: { type: [String], default: [] },
      status: { type: String, enum: ['draft', 'published'], default: 'draft' },
      publishAt: { type: Date, default: null },
   },
   {
      timestamps: true, // otomatic generate createdAt and updatedAt
   }
);

export const Posts = mongoose.model('Posts', postSchema);
