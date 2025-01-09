import { connectToDatabase } from "@/lib/db";
import Episode from "@/models/Episode";

export async function GET(req, { params }) {
    const { id } = await params; // Extract the episode ID
    try {
        await connectToDatabase();

        const episode = await Episode.findById(id);
        if (!episode) {
            return new Response(
                JSON.stringify({ error: "Episode not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(episode), { status: 200 });
    } catch (error) {
        console.error("Error fetching episode:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to fetch episode" }),
            { status: 500 }
        );
    }
}
