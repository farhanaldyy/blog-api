import postingModel from '../models/posting.model';

// Simple create posting blog
export const createPost = async (req, res) => {
   try {
      const doc = await postingModel.create(req.body);
      res.json(doc);
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
};
