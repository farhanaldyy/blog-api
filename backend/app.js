import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/posts.routes.js';

import { errorHandler } from './middleware/errorHandler.js';
import AppError from './utils/appError.js';

export const app = express();

app.use(
   cors({
      // origin: true, if use postman
      origin: 'http://localhost:5500',
      credentials: true,
   })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', postRoutes);

// 404 error handler
app.all(/.*/, (req, res, next) => {
   next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// global error middleware
app.use(errorHandler);
