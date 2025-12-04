import { Posts } from '../models/posting.model.js';

// simple create posting blog
export const createPost = async (req, res) => {
   try {
      const { title, content, excerpt, tags = [], categories = [] } = req.body;

      // cover image dump
      const coverImageUrl = '/uploads/file.jpg';

      const posts = await Posts.create({
         title,
         slug: (title || '').toLowerCase().replace(/\s+/g, '-'),
         content,
         excerpt,
         coverImage: coverImageUrl,
         authorId: req.user.id,
         tags: Array.isArray(tags) ? tags : tags.split(',').map((arr) => arr.trim()),
         categories: Array.isArray(categories) ? categories : categories.split(',').map((arr) => arr.trim()),
         status: 'draft',
      });

      res.status(201).json({
         message: 'Your blog created successfully',
         posts: {
            title: posts.title,
            authorId: posts.authorId,
            tags: posts.tags,
            status: posts.status,
         },
      });
   } catch (err) {
      res.status(400).json({ message: 'Server error: ', error: err.message });
   }
};
