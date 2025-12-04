import { Posts } from '../models/posting.model.js';

/**
 * options :
 * - requireRole: string | array of roles that are allowed to perform action (e.g. 'author' or 'admin')
 * - ownership: boolean (if true, check the req.params.id ownership of post)
 */

export const isAuthor = (options = {}) => {
   const { requireRole = null, ownership = false } = options;

   return async (req, res, next) => {
      try {
         // req.user should be set by protected middleware
         const user = req.user;
         if (!user) return res.status(401).json({ message: 'Not authenticated' });

         // role-based check (if requested)
         if (requireRole) {
            const required = Array.isArray(requireRole) ? requireRole : [requireRole];
            if (!required.includes(user.role)) {
               return res.status(403).json({ message: 'Insufficient role, role must be (author / admin)' });
            }
         }

         // ownership-based check (if requested)
         if (ownership) {
            const postId = req.params.id || req.body.authorId;
            if (!postId) {
               return res.status(400).json({ message: 'No resource id provided for ownership check' });
            }

            // find id in collection
            const post = await Posts.findById(postId).select('authorId');
            if (!post) return res.status(400).json({ message: 'Post not found' });

            // compare ObjectIds as string
            if (post.authorId.toString() !== user._id.toString() && user.role !== 'admin') {
               return res.status(403).json({ message: 'You are not the author of this post' });
            }
         }

         next();
      } catch (err) {
         next(err);
      }
   };
};
