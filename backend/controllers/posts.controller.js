import { Posts } from '../models/posting.model.js';

// read post (author)
export const readPost = async (req, res, next) => {
   try {
      const posts = await Posts.find({ authorId: req.user.id }).lean();

      if (!posts) res.status(404).json({ message: 'Data not found!' });

      res.json(posts);
   } catch (err) {
      next(err);
   }
};

// simple create posting blog
export const createPost = async (req, res, next) => {
   try {
      const { title, content, excerpt, tags = [], categories = [], publishAt, status } = req.body;

      const coverImageUrl = req.file ? `/uploads/cover/${req.file.filename}` : null;

      const posts = await Posts.create({
         title,
         slug: (title || '').toLowerCase().replace(/\s+/g, '-'),
         content,
         excerpt,
         coverImage: coverImageUrl,
         authorId: req.user.id,
         tags: Array.isArray(tags) ? tags : tags.split(',').map((arr) => arr.trim()),
         categories: Array.isArray(categories) ? categories : categories.split(',').map((arr) => arr.trim()),
         status,
         publishAt: publishAt ? new Date(publishAt) : null,
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
      // res.status(400).json({ message: 'Server error: ', error: err.message });
      next(err);
   }
};

export const updatePost = async (req, res, next) => {
   try {
      const { title, content, excerpt, tags, categories } = req.body;
      const update = {};

      // check if client update image
      if (req.file) update.coverImage = `/uploads/cover/${req.file.filename}`;

      // check req client, format tags and categories
      if (title) update.title = title;
      if (content) update.content = content;
      if (excerpt) update.excerpt = excerpt;
      if (tags) {
         Array.isArray(tags) ? (update.tags = tags) : (update.tags = tags.split(',').map((arr) => arr.trim()));
      }
      if (categories) {
         Array.isArray(categories) ? (update.categories = categories) : (update.categories = categories.split(',').map((arr) => arr.trim()));
      }

      const post = await Posts.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.json(post);
   } catch (err) {
      // res.status(400).json({ message: 'Server error: ', error: err.message });
      next(err);
   }
};

export const deletePost = async (req, res, next) => {
   try {
      await Posts.findByIdAndDelete(req.params.id);
      res.status(204).end();
   } catch (err) {
      next(err);
   }
};
