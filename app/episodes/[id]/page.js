"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function EpisodeDetailsPage({ params }) {
    const episodeId = React.use(params).id;
    const [episode, setEpisode] = useState(null);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuality, setCurrentQuality] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchEpisodeAndMovie = async () => {
            try {
                // Fetch episode details
                const episodeResponse = await fetch(`/api/episodes/${episodeId}`);
                if (!episodeResponse.ok) throw new Error("Failed to fetch episode");
                const episodeData = await episodeResponse.json();
                setEpisode(episodeData);

                // Fetch movie/series details
                const movieResponse = await fetch(`/api/movies/${episodeData.movieId}`);
                if (!movieResponse.ok) throw new Error("Failed to fetch related movie/series");
                const movieData = await movieResponse.json();
                setMovie(movieData);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodeAndMovie();
    }, [episodeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div>Loading video...</div>
            </div>
        );
    }

    if (!episode || !movie) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-white">Episode not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navigation Header */}
            <div className="bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => router.push(`/movies/${movie._id}`)}
                            className="flex items-center text-gray-300 hover:text-white transition"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to {movie.title}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Episode Info */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <h1 className="text-3xl font-bold text-white">{episode.title}</h1>
                        <span className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full">
                            Episode {episode.episodeNumber}
                        </span>
                        {episode.duration && (
                            <span className="text-gray-400">{episode.duration} min</span>
                        )}
                    </div>
                    <p className="text-gray-300 max-w-3xl">{episode.description}</p>
                </div>

                {/* Video Player Section */}
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                    {episode.streamingUrls && episode.streamingUrls.length > 0 ? (
                        <div>
                            <video
                                controls
                                className="w-full aspect-video bg-black"
                                src={episode.streamingUrls[currentQuality]}
                                poster={episode.thumbnailUrl}
                            >
                                Your browser does not support the video tag.
                            </video>
                            
                            {/* Video Controls */}
                            <div className="p-4 border-t border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {episode.streamingUrls.length > 1 && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 text-sm">Quality:</span>
                                                <select
                                                    value={currentQuality}
                                                    onChange={(e) => setCurrentQuality(Number(e.target.value))}
                                                    className="bg-gray-700 text-white text-sm rounded px-2 py-1"
                                                >
                                                    {episode.streamingUrls.map((_, index) => (
                                                        <option key={index} value={index}>
                                                            {index === 0 ? "1080p" : index === 1 ? "720p" : "480p"}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {episode.nextEpisodeId && (
                                        <button
                                            onClick={() => router.push(`/episodes/${episode.nextEpisodeId}`)}
                                            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition"
                                        >
                                            <span>Next Episode</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-96">
                            <p className="text-gray-400">This episode is not yet available.</p>
                        </div>
                    )}
                </div>

                {/* Additional Episode Information */}
                {episode.additionalInfo && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(episode.additionalInfo).map(([key, value]) => (
                            <div key={key} className="bg-gray-800 rounded-lg p-4">
                                <h3 className="text-gray-400 text-sm mb-1">{key}</h3>
                                <p className="text-white">{value}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}