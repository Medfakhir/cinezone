import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        releaseDate: { type: Date, required: true },
        posterUrl: { type: String },
        isSeries: { type: Boolean, default: false },
        categories: { type: [String], required: true }, // Update to array of strings
        episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episode" }],
    },
    {
        collection: "Movie", // Explicitly set the collection name
    }
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default Movie;
