"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Save, ArrowLeft, X, Upload } from "lucide-react";

export default function EditMoviePage({ params }) {
    const movieId = React.use(params).id || params?.id;
    const [movie, setMovie] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        releaseDate: "",
        isSeries: false,
        categories: [], // Categories as an array
    });
    const [posterFile, setPosterFile] = useState(null);
    const [posterUrl, setPosterUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch(`/api/movies/${movieId}`);
                if (!response.ok) throw new Error("Failed to fetch movie details");
                const data = await response.json();
                setMovie(data);
                setFormData({
                    title: data.title,
                    description: data.description,
                    releaseDate: data.releaseDate.split("T")[0],
                    isSeries: data.isSeries,
                    categories: data.categories || [], // Default to an empty array
                });
                setPosterUrl(data.posterUrl);
            } catch (err) {
                setError(err.message);
            }
        };

        if (movieId) {
            fetchMovie();
        } else {
            setError("Movie ID is missing.");
        }
    }, [movieId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPosterFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPosterFile(null);
        setPreviewUrl(null);
        if (!posterUrl) {
            setPosterUrl("");
        }
    };

    const handleAddCategory = (category) => {
        if (category.trim() && !formData.categories.includes(category)) {
            setFormData((prev) => ({
                ...prev,
                categories: [...prev.categories, category.trim()],
            }));
        }
    };

    const handleRemoveCategory = (index) => {
        setFormData((prev) => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index),
        }));
    };

    const handleUpdateMovie = async () => {
        if (!formData.title || !formData.description || !formData.releaseDate || formData.categories.length === 0) {
            setError("All fields are required, including at least one category.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "categories") {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            if (posterFile) {
                formDataToSend.append("poster", posterFile);
            }

            const response = await fetch(`/api/movies/${movieId}`, {
                method: "PUT",
                body: formDataToSend,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update movie");
            }

            setSuccess("Movie updated successfully!");
            setError(null);
            setTimeout(() => router.push("/admin/movies"), 2000);
        } catch (err) {
            setSuccess(null);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (error && !movie) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Movies
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    Edit {formData.isSeries ? "Series" : "Movie"}
                </h1>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Movie Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Release Date
                                </label>
                                <input
                                    type="date"
                                    name="releaseDate"
                                    value={formData.releaseDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter a category"
                                        id="category-input"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const categoryInput = document.getElementById("category-input");
                                            const category = categoryInput.value.trim();
                                            if (category && !formData.categories.includes(category)) {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    categories: [...prev.categories, category],
                                                }));
                                                categoryInput.value = ""; // Clear input field
                                            }
                                        }}
                                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-500"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap mt-2 gap-2">
                                    {formData.categories.map((category, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center"
                                        >
                                            {category}
                                            <button
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        categories: prev.categories.filter((_, i) => i !== index),
                                                    }))
                                                }
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Poster Image
                            </label>
                            <div className="mt-1 flex flex-col items-center space-y-4">
                                {(previewUrl || posterUrl) && (
                                    <div className="relative">
                                        <img
                                            src={previewUrl || posterUrl}
                                            alt="Movie Poster"
                                            className="max-w-xs rounded-lg shadow-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg w-full">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                                                <span>Upload a file</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isSeries"
                                checked={formData.isSeries}
                                onChange={handleChange}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label className="text-sm text-gray-700">Is this a series?</label>
                        </div>

                        <div className="flex justify-end pt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 mr-4"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateMovie}
                                disabled={isSubmitting}
                                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="h-5 w-5 mr-2" />
                                {isSubmitting ? "Updating..." : "Update Movie"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
