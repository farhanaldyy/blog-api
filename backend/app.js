import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/posts.routes.js';

import { errorHandler } from './middleware/errorHandler.js';
import AppError from './utils/appError.js';

export const app = express();

const allowOrigins = [
   'http://localhost:5500', // live server
   'http://127.0.0.1:5500',
   'http://localhost:3000', // serve
   'http://127.0.0.1:3000',
   'http://localhost:8080', // serve
   'http://127.0.0.1:8080',
];

app.use(
   cors({
      // origin: true, all allowed
      origin: allowOrigins,
      credentials: true,
   })
);

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', postRoutes);

// 404 error handler
app.all(/.*/, (req, res, next) => {
   next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// global error middleware
app.use(errorHandler);
