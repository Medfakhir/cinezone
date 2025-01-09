import { connectToDatabase } from "@/lib/db";
import Movie from "@/models/Movie";

export async function GET() {
    try {
        await connectToDatabase();

        const moviesCount = await Movie.countDocuments({ isSeries: false });
        const seriesCount = await Movie.countDocuments({ isSeries: true });

        return new Response(JSON.stringify({ moviesCount, seriesCount }), { status: 200 });
    } catch (error) {
        console.error("Error fetching counts:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to fetch counts" }),
            { status: 500 }
        );
    }
}
