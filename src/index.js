import express from 'express';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use('',authRoutes);
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Server started on port 3000'));
