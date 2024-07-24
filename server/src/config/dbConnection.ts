import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  } catch (error) {
    console.error(error);
  }
};
