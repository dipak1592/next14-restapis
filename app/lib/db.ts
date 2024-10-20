import mongoose from "mongoose";

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

const connect = async (): Promise<void> => {
  if (!MONGODB_URI) {
    throw new Error("MongoDB URI is not defined in environment variables.");
  }

  const connectionState: number = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connection in progress...");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "next14restapi",
      serverSelectionTimeoutMS: 30000,  
      bufferCommands: true,  
    });
    console.log("MongoDB Connected Successfully😍");
  } catch (error: unknown) {  
    if (error instanceof Error) {
      console.log("Connection error😒:", error.message);
      throw new Error("Error connecting to MongoDB: " + error.message);
    } else {
      throw new Error("An unknown error occurred during MongoDB connection.");
    }
  }
};

export default connect;
