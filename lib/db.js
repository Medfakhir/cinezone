import mongoose from "mongoose";

const MONGO_URI = process.env.DATABASE_URL;

let isConnected = false; // Track connection state

export async function connectToDatabase() {
    if (isConnected) {
        console.log("Already connected to MongoDB.");
        return;
    }

    try {
        const db = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Adjust timeout
        });

        isConnected = db.connections[0].readyState === 1;
        console.log("Connected to MongoDB.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw new Error("Failed to connect to MongoDB.");
    }
}
