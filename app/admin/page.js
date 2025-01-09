"use client";

import { useState, useEffect } from "react";
import { Loader2, Film, Tv, TrendingUp, Users } from "lucide-react";

export default function AdminDashboard() {
  const [moviesCount, setMoviesCount] = useState(null);
  const [seriesCount, setSeriesCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/movies/count");
        if (!response.ok) throw new Error("Failed to fetch counts");
        const data = await response.json();
        setMoviesCount(data.moviesCount || 0);
        setSeriesCount(data.seriesCount || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-red-100 p-6 text-red-600">
          <p className="text-center font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-6">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Movies Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Total Movies</p>
                <p className="mt-2 text-3xl font-bold">{moviesCount}</p>
              </div>
              <Film className="h-10 w-10 opacity-40" />
            </div>
            <div className="mt-4 text-sm">
              <span className="flex items-center gap-1 font-medium">
                <TrendingUp className="h-4 w-4" />
                Active Collection
              </span>
            </div>
          </div>

          {/* Total Series Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Total Series</p>
                <p className="mt-2 text-3xl font-bold">{seriesCount}</p>
              </div>
              <Tv className="h-10 w-10 opacity-40" />
            </div>
            <div className="mt-4 text-sm">
              <span className="flex items-center gap-1 font-medium">
                <TrendingUp className="h-4 w-4" />
                Active Collection
              </span>
            </div>
          </div>

          {/* Additional Stats Cards */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Total Views</p>
                <p className="mt-2 text-3xl font-bold">125K</p>
              </div>
              <Users className="h-10 w-10 opacity-40" />
            </div>
            <div className="mt-4 text-sm">
              <span className="flex items-center gap-1 font-medium">
                <TrendingUp className="h-4 w-4" />
                Last 30 days
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Active Users</p>
                <p className="mt-2 text-3xl font-bold">3.2K</p>
              </div>
              <Users className="h-10 w-10 opacity-40" />
            </div>
            <div className="mt-4 text-sm">
              <span className="flex items-center gap-1 font-medium">
                <TrendingUp className="h-4 w-4" />
                Currently Online
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}