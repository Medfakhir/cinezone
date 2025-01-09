import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        const { id } = await params;

        if (!id) {
            return new Response(JSON.stringify({ error: "ID is required" }), {
                status: 400,
            });
        }

        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const decoded = jwt.verify(token, SECRET_KEY);

        // Allow only the user themselves or an admin to fetch the data
        if (decoded.id !== id && !decoded.isAdmin) {
            return new Response(JSON.stringify({ error: "Access denied" }), {
                status: 403,
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        return new Response(
            JSON.stringify({ id: user._id, username: user.username, isAdmin: user.isAdmin }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in /api/auth/login/[id]:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to fetch user" }),
            { status: 500 }
        );
    }
}
