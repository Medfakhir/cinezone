import { connectToDatabase } from "@/lib/db";
import Episode from "@/models/Episode";
import mongoose from "mongoose";

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const movieId = searchParams.get("movieId");

        if (!movieId || !mongoose.Types.ObjectId.isValid(movieId)) {
            return new Response(
                JSON.stringify({ error: "Invalid or missing movieId" }),
                { status: 400 }
            );
        }

        const episodes = await Episode.find({ movieId });
        return new Response(JSON.stringify(episodes), { status: 200 });
    } catch (error) {
        console.error("Error fetching episodes:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to fetch episodes" }),
            { status: 500 }
        );
    }
}
export async function POST(req) {
    try {
        await connectToDatabase();

        const { title, description, streamingUrls, movieId } = await req.json();

        if (!title || !description || !streamingUrls || !movieId) {
            return new Response(
                JSON.stringify({ error: "All fields are required" }),
                { status: 400 }
            );
        }

        const newEpisode = await Episode.create({
            title,
            description,
            streamingUrls,
            movieId,
        });

        return new Response(JSON.stringify(newEpisode), { status: 201 });
    } catch (error) {
        console.error("Error creating episode:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to create episode" }),
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const episodeId = searchParams.get("id");

        if (!episodeId || !mongoose.Types.ObjectId.isValid(episodeId)) {
            return new Response(
                JSON.stringify({ error: "Invalid or missing episodeId" }),
                { status: 400 }
            );
        }

        await Episode.findByIdAndDelete(episodeId);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Error deleting episode:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to delete episode" }),
            { status: 500 }
        );
    }
}
export async function PUT(req) {
    try {
        await connectToDatabase();

        const { id, title, description, streamingUrls } = await req.json();

        if (!id || !title || !description || !streamingUrls) {
            return new Response(
                JSON.stringify({ error: "All fields are required" }),
                { status: 400 }
            );
        }

        const updatedEpisode = await Episode.findByIdAndUpdate(
            id,
            { title, description, streamingUrls },
            { new: true }
        );

        if (!updatedEpisode) {
            return new Response(
                JSON.stringify({ error: "Episode not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(updatedEpisode), { status: 200 });
    } catch (error) {
        console.error("Error updating episode:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to update episode" }),
            { status: 500 }
        );
    }
}
