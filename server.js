import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import formRoutes from './routes/form.routes.js';
import authRoutes from './routes/auth.routes.js';
import respRoutes from './routes/resp.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resp', respRoutes);

const PORT = process.env.PORT || '5000';

// Function to connect to MongoDB and start the server
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected");
  } catch (err) {
    console.error(err);
  }
}

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));