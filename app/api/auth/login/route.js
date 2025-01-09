import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        await connectToDatabase();
        console.log("Connected to the database");

        const { username, password } = await req.json();
        console.log("Received credentials:", { username, password });

        if (!username || !password) {
            console.log("Missing username or password");
            return new Response(
                JSON.stringify({ error: "Username and password are required" }),
                { status: 400 }
            );
        }

        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found:", username);
            return new Response(
                JSON.stringify({ error: "Invalid credentials" }),
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password for user:", username);
            return new Response(
                JSON.stringify({ error: "Invalid credentials" }),
                { status: 401 }
            );
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, SECRET_KEY, {
            expiresIn: "1h",
        });

        console.log("Login successful for user:", username);
        return new Response(
            JSON.stringify({ token, username: user.username, isAdmin: user.isAdmin }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to log in" }),
            { status: 500 }
        );
    }
}

