"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Film, AlertCircle, Link as LinkIcon, Edit3 } from "lucide-react";

export default function EpisodesPage({ params }) {
    const movieId = React.use(params).id;
    const [episodes, setEpisodes] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [streamingUrls, setStreamingUrls] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editEpisodeId, setEditEpisodeId] = useState(null);

    useEffect(() => {
        if (!movieId) {
            setError("Movie ID is missing.");
            return;
        }

        const fetchEpisodes = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/episodes?movieId=${movieId}`);
                if (!response.ok) throw new Error("Failed to fetch episodes");
                const data = await response.json();
                setEpisodes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEpisodes();
    }, [movieId]);

    const handleAddEpisode = async () => {
        try {
            const response = await fetch("/api/episodes", {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    streamingUrls: streamingUrls.split(","),
                    movieId,
                    id: isEditing ? editEpisodeId : undefined,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save episode");
            }

            const updatedEpisode = await response.json();

            if (isEditing) {
                setEpisodes((prev) =>
                    prev.map((ep) => (ep._id === editEpisodeId ? updatedEpisode : ep))
                );
                setIsEditing(false);
                setEditEpisodeId(null);
            } else {
                setEpisodes((prev) => [...prev, updatedEpisode]);
            }

            setTitle("");
            setDescription("");
            setStreamingUrls("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditEpisode = (episode) => {
        setIsEditing(true);
        setEditEpisodeId(episode._id);
        setTitle(episode.title);
        setDescription(episode.description);
        setStreamingUrls(episode.streamingUrls.join(","));
    };

    

    const handleDeleteEpisode = async (episodeId) => {
        if (window.confirm("Are you sure you want to delete this episode?")) {
            try {
                const response = await fetch(`/api/episodes?id=${episodeId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error("Failed to delete episode");
                }

                setEpisodes((prev) => prev.filter((ep) => ep._id !== episodeId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleAddOrUpdateEpisode = async () => {
        try {
            const payload = {
                id: isEditing ? editEpisodeId : undefined, // Include id if editing
                title,
                description,
                streamingUrls: streamingUrls.split(","), // Convert string to array
                movieId, // Always include movieId
            };
    
            const response = await fetch("/api/episodes", {
                method: isEditing ? "PUT" : "POST", // Use PUT for updates, POST for new episodes
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error(isEditing ? "Failed to update episode" : "Failed to add episode");
            }
    
            const newOrUpdatedEpisode = await response.json();
    
            if (isEditing) {
                // Update the episode in the local state
                setEpisodes((prev) =>
                    prev.map((ep) => (ep._id === editEpisodeId ? newOrUpdatedEpisode : ep))
                );
                setIsEditing(false);
                setEditEpisodeId(null);
            } else {
                // Add the new episode to the local state
                setEpisodes((prev) => [...prev, newOrUpdatedEpisode]);
            }
    
            // Clear the form
            setTitle("");
            setDescription("");
            setStreamingUrls("");
        } catch (err) {
            setError(err.message);
        }
    };
    
    

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Episodes Management</h1>
            </div>
            <div className="p-6 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-5 w-5" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {isEditing ? "Edit Episode" : "Add New Episode"}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Episode Title
                            </label>
                            <input
                                type="text"
                                placeholder="Enter episode title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="block w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                placeholder="Enter episode description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="block w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Streaming URLs
                            </label>
                            <input
                                type="text"
                                placeholder="Enter comma-separated streaming URLs"
                                value={streamingUrls}
                                onChange={(e) => setStreamingUrls(e.target.value)}
                                className="block w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleAddOrUpdateEpisode}
                            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            {isEditing ? "Update Episode" : "Add Episode"}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Episode
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        URLs
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {episodes.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            <Film className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                            <p className="text-lg font-medium">No episodes found</p>
                                            <p className="text-sm">
                                                Add your first episode using the form above
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    episodes.map((episode) => (
                                        <tr
                                            key={episode._id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {episode.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500">
                                                    {episode.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <LinkIcon className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-500">
                                                        {episode.streamingUrls?.length || 0} URLs
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        handleEditEpisode(episode)
                                                    }
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors mr-2"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteEpisode(episode._id)
                                                    }
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
