import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    streamingUrls: [{ type: String }],
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
},{
    collection: "Episode", // Explicitly set the collection name
});

const Episode = mongoose.models.Episode || mongoose.model("Episode", episodeSchema);

export default Episode; // Export as default
