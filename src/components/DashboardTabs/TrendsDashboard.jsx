import { Loader2, Newspaper, RefreshCcw, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";

const TrendsDashboard = ({ user, includeTrends, setIncludeTrends }) => {
  const [trends, setTrends] = useState([]);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [trendsLastUpdated, setTrendsLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.uid || user?.id) {
      loadTrends();
    }
  }, [user]);

  const loadTrends = async () => {
    setLoadingTrends(true);
    setError(null);
    try {
      // Get user topics with fallback
      const userTopics =
        user?.topics && Array.isArray(user.topics) && user.topics.length > 0
          ? user.topics
          : ["business", "technology"];

      const response = await fetch(
        `http://localhost:3001/api/trends?topics=${userTopics.join(
          ","
        )}&limit=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTrends(data.trends || []);
        if (data.lastUpdated) {
          setTrendsLastUpdated(new Date(data.lastUpdated));
        }
      } else {
        setError(data.error || "Failed to load trends");
        setTrends([]);
      }
    } catch (error) {
      setError("Failed to connect to server");
      setTrends([]);
    } finally {
      setLoadingTrends(false);
    }
  };

  const refreshTrends = async () => {
    setLoadingTrends(true);
    setError(null);
    try {
      // Get user topics with fallback
      const userTopics =
        user?.topics && Array.isArray(user.topics) && user.topics.length > 0
          ? user.topics
          : ["business", "technology"];

      const response = await fetch("http://localhost:3001/api/trends/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          topics: userTopics,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Reload trends after successful refresh
        await loadTrends();
      } else {
        setError(data.error || "Failed to refresh trends");
      }
    } catch (error) {
      setError("Failed to connect to server");
    } finally {
      setLoadingTrends(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-violet-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-zinc-900">
              Current Industry Trends
            </h3>
            <p className="text-sm text-zinc-600 font-medium">
              {trendsLastUpdated
                ? `Last updated: ${trendsLastUpdated.toLocaleTimeString()}`
                : "Loading trends..."}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeTrends"
              checked={includeTrends}
              onChange={(e) => setIncludeTrends(e.target.checked)}
              className="w-4 h-4 text-violet-600 rounded border-zinc-300 focus:ring-violet-500"
            />
            <label
              htmlFor="includeTrends"
              className="text-sm text-zinc-700 font-medium"
            >
              Include in posts
            </label>
          </div>

          <button
            onClick={refreshTrends}
            disabled={loadingTrends}
            className="flex items-center space-x-2 px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
          >
            {loadingTrends ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4" />
            )}
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loadingTrends && trends.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
          <span className="ml-2 text-zinc-600">Loading trending topics...</span>
        </div>
      ) : trends.length > 0 ? (
        <div className="space-y-3">
          {trends.slice(0, 5).map((trend, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 border border-zinc-200/80 rounded-xl hover:bg-zinc-50/80 transition-all duration-200"
            >
              <div className="p-2 bg-violet-50 rounded-lg">
                <Newspaper className="w-4 h-4 text-violet-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-zinc-900 text-sm leading-snug">
                  {trend.title || "No title available"}
                </h4>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  {trend.summary || "No summary available"}
                </p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-xs text-zinc-500 font-medium">
                    {trend.source || "Unknown"}
                  </span>
                  {trend.publishDate && (
                    <>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs text-zinc-500">
                        {new Date(trend.publishDate).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-violet-400" />
          </div>
          <h4 className="text-lg font-semibold text-zinc-900 mb-2">
            No trends available
          </h4>
          <p className="text-zinc-600 text-sm mb-4">
            {error
              ? "Please try refreshing again."
              : "Click refresh to load current trends."}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrendsDashboard;
