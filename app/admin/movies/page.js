"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Film, Pencil, Trash2, Plus, Search, AlertCircle } from "lucide-react";

export default function MoviesPage() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/movies");
                if (!response.ok) {
                    throw new Error("Failed to fetch movies");
                }
                const data = await response.json();
                setMovies(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const handleAddMovie = () => {
        router.push("/admin/movies/create");
    };

    const handleEdit = (movieId) => {
        router.push(`/admin/movies/edit/${movieId}`);
    };

   const handleDelete = async (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
        try {
            const response = await fetch(`/api/movies/${movieId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete movie");
            }

            // Remove the movie from the state
            setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== movieId));

            alert("Movie deleted successfully");
        } catch (err) {
            console.error("Error deleting movie:", err.message);
            alert("Failed to delete movie");
        }
    }
};


    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleAddMovie}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Movie
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catregory</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Date</th>
                                
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMovies.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        <Film className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-lg font-medium">No movies found</p>
                                        <p className="text-sm">Add a new movie or try a different search term</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredMovies.map((movie, index) => (
                                    <tr key={movie.id || index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {movie.posterUrl ? (
                                                    <img
                                                        src={movie.posterUrl}
                                                        alt={`${movie.title} Poster`}
                                                        className="w-12 h-16 object-cover rounded-lg shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Film className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">{movie.title}</p>
                                                    <p className="text-sm text-gray-500">ID: {movie._id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                movie.isSeries 
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {movie.isSeries ? "Series" : "Movie"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-gray-700 font-medium">
    {movie.categories && movie.categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
            {movie.categories.map((category, index) => (
                <span
                    key={index}
                    className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                >
                    {category}
                </span>
            ))}
        </div>
    ) : (
        <span className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
            No Categories
        </span>
    )}
</td>


                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => router.push(`/admin/movies/${movie._id}/episodes`)}
                                        className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors mr-2"
                                    >
                                        Manage Episodes
                                    </button>
                                    <button
                                        onClick={() => handleEdit(movie._id)}
                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors mr-2"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(movie._id)}
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
    );
}