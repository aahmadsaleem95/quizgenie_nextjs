import mongoose from "mongoose";

export const connectDB = async () => {
  console.log("Hello in connect DB");
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected:", connection.connection.host);
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};

// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;
// console.log("MONGODB_URI: ", MONGODB_URI);

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export async function connectDB() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI);
//     console.log("MongoDB connected:", cached.promise.connection.host);
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }
