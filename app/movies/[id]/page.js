"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function MovieDetailsPage({ params }) {
  const movieId = React.use(params).id;
  const [movie, setMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`/api/movies/${movieId}`);
        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();
        setMovie(data);

        const episodesResponse = await fetch(`/api/episodes?movieId=${movieId}`);
        if (!episodesResponse.ok) throw new Error("Failed to fetch episodes");
        const episodesData = await episodesResponse.json();
        setEpisodes(episodesData);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Movie not found</div>
      </div>
    );
  }

  const seasons = [...new Set(episodes.map((ep) => ep.season || 1))];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        {isTrailerPlaying ? (
          <div className="absolute inset-0 bg-black z-20">
            <div className="relative h-full">
              <iframe
                src={movie.trailerUrl}
                className="w-full h-full"
                allowFullScreen
              />
              <button
                onClick={() => setIsTrailerPlaying(false)}
                className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0">
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                <div className="w-48 h-72 flex-shrink-0 relative rounded-lg overflow-hidden shadow-2xl group">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-white">
                  <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>
                  <p className="text-gray-300 max-w-2xl mb-6">{movie.description}</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => router.push(`/watch/${movie._id}`)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      Watch Now
                    </button>
                    {movie.trailerUrl && (
                      <button
                        onClick={() => setIsTrailerPlaying(true)}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition flex items-center gap-2"
                      >
                        Watch Trailer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`px-6 py-4 text-sm font-medium transition ${
              selectedTab === "overview"
                ? "text-white border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          {episodes.length > 0 && (
            <button
              onClick={() => setSelectedTab("episodes")}
              className={`px-6 py-4 text-sm font-medium transition ${
                selectedTab === "episodes"
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Episodes
            </button>
          )}
          {movie.cast?.length > 0 && (
            <button
              onClick={() => setSelectedTab("cast")}
              className={`px-6 py-4 text-sm font-medium transition ${
                selectedTab === "cast"
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Cast & Crew
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {selectedTab === "overview" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Storyline</h2>
            <p className="text-gray-300">{movie.description}</p>
          </div>
        )}
{selectedTab === "episodes" && episodes.length > 0 && (
  <div>
    <h2 className="text-3xl font-bold text-white mb-6">Episodes</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 ">
      {episodes.map((episode) => (
        <div
          key={episode._id}
          className="p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <button
            onClick={() => router.push(`/episodes/${episode._id}`)}
            className="flex flex-col items-center gap-2 w-full"
          >
            {/* Episode Title (Small Font) */}
            <h3 className="text-sm font-medium text-white">{episode.title}</h3>

            {/* Movie Image (Bigger Image) */}
            {movie && movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={`Movie poster for ${episode.title}`}
                className="w-32 h-48 object-cover rounded-md transition-transform duration-300 transform hover:scale-105"
              />
            )}
          </button>
        </div>
      ))}
    </div>
  </div>
)}



        {selectedTab === "cast" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Cast & Crew</h2>
            {movie.cast.map((person) => (
              <div key={person.id} className="text-gray-300">
                {person.name} as {person.role}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
