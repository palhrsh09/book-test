import mongoose from "mongoose";

export const ConnectDB = () => {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

}
  