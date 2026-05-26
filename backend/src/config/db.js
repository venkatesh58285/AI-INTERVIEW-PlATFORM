import mongoose from "mongoose";

// mongoose.connect(process.env.MONGO_URI);

const connectDB = async () => {
  try {
    // console.log("DEBUG-1 at connection");
    await mongoose.connect(process.env.MONGO_URI);
    // console.log("DB Connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

export default connectDB;
