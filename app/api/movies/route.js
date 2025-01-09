import { connectToDatabase } from "@/lib/db";
import Movie from "@/models/Movie";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  export async function POST(req) {
    try {
        const data = await req.json();

        console.log("Received data:", data); // Log the incoming request body

        // Validate required fields
        if (!data.title || !data.description || !data.releaseDate || !data.categories || !data.file) {
            return new Response(
                JSON.stringify({ error: "All fields are required, including an image file." }),
                { status: 400 }
            );
        }

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(data.file, {
            folder: "movies",
        });

        console.log("Cloudinary upload response:", uploadResponse); // Log Cloudinary response

        // Connect to the database
        await connectToDatabase();

        // Create a new movie
        const newMovie = await Movie.create({
            title: data.title,
            description: data.description,
            releaseDate: data.releaseDate,
            posterUrl: uploadResponse.secure_url, // Use Cloudinary URL
            categories: data.categories, // Handle categories as an array
            isSeries: data.isSeries,
        });

        return new Response(JSON.stringify(newMovie), { status: 201 });
    } catch (error) {
        console.error("Error creating movie:", error); // Log full error object
        return new Response(JSON.stringify({ error: "Failed to create movie." }), { status: 500 });
    }
}




export async function GET(req) {
    try {
        await connectToDatabase();

        // Fetch all movies from the database
        const movies = await Movie.find();

        return new Response(JSON.stringify(movies), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        return new Response(JSON.stringify({ error: "Failed to fetch movies" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}