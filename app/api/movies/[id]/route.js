import { connectToDatabase } from "@/lib/db";
import Movie from "@/models/Movie";
import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
  
export async function GET(req, context) {
    const { id: movieId } = await context.params; // Await the `params` object

    try {
        await connectToDatabase();

        const movie = await Movie.findById(movieId);

        if (!movie) {
            return new Response(
                JSON.stringify({ error: "Movie not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(movie), { status: 200 });
    } catch (error) {
        console.error("Error fetching movie:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to fetch movie" }),
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
  const { id: movieId } = params;

  try {
      // Parse the FormData from the request
      const formData = await req.formData();

      // Extract the data from FormData
      const title = formData.get("title");
      const description = formData.get("description");
      const releaseDate = formData.get("releaseDate");
      const isSeries = formData.get("isSeries") === "true"; // Convert string to boolean
      const categories = JSON.parse(formData.get("categories") || "[]"); // Parse categories JSON
      const poster = formData.get("poster"); // Get the poster file if it exists

      console.log("Received data for update:", { title, description, releaseDate, isSeries, categories });

      // Validate required fields
      if (!title || !description || !releaseDate || categories.length === 0) {
          return new Response(
              JSON.stringify({ error: "All fields are required, including categories." }),
              { status: 400 }
          );
      }

      await connectToDatabase();

      let updatedData = {
          title,
          description,
          releaseDate,
          isSeries,
          categories,
      };

      // Handle poster upload if a new file is provided
      if (poster && typeof poster === "object") {
          const buffer = await poster.arrayBuffer();
          const base64Image = Buffer.from(buffer).toString("base64");
          const uploadResponse = await cloudinary.uploader.upload(`data:${poster.type};base64,${base64Image}`, {
              folder: "movies",
          });

          console.log("Cloudinary upload response:", uploadResponse); // Debugging log
          updatedData.posterUrl = uploadResponse.secure_url; // Update poster URL
      }

      // Update movie in the database
      const updatedMovie = await Movie.findByIdAndUpdate(movieId, updatedData, { new: true });

      if (!updatedMovie) {
          return new Response(
              JSON.stringify({ error: "Movie not found." }),
              { status: 404 }
          );
      }

      return new Response(JSON.stringify(updatedMovie), { status: 200 });
  } catch (error) {
      console.error("Error updating movie:", error); // Debugging log
      return new Response(
          JSON.stringify({ error: "Failed to update movie." }),
          { status: 500 }
      );
  }
}



export async function DELETE(req, context) {
    const { id: movieId } = await context.params; // Await the `params` object

    try {
        await connectToDatabase();

        const deletedMovie = await Movie.findByIdAndDelete(movieId);

        if (!deletedMovie) {
            return new Response(
                JSON.stringify({ error: "Movie not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify({ message: "Movie deleted successfully" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error deleting movie:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to delete movie" }),
            { status: 500 }
        );
    }
}

