import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import postRoutes from './routes/postRoute';
import commentRoutes from './routes/commentRoute';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Register routes
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/posts', postRoutes);
app.use(commentRoutes);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error('MongoDB connection string is missing in .env file.');
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });