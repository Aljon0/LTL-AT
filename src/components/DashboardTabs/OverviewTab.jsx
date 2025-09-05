import {
  Calendar,
  Crown,
  FileText,
  Settings,
  Target,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import React from "react";

const OverviewTab = ({ user, posts }) => {
  const stats = [
    {
      label: "Total Posts",
      value: posts.length.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "This Month",
      value: "8",
      icon: Calendar,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Avg. Engagement",
      value: "108",
      icon: Target,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      label: "Subscription",
      value: user.subscription,
      icon: Crown,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:shadow-zinc-200/60 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 mb-2 font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-zinc-900 capitalize">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 ${stat.bgColor} rounded-xl border border-opacity-20`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <h3 className="text-xl font-semibold text-zinc-900 mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-5 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:from-zinc-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5 font-medium">
            <Zap className="w-5 h-5" />
            <span>Generate New Post</span>
          </button>
          <button className="flex items-center space-x-3 p-5 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-200 cursor-pointer font-medium">
            <Upload className="w-5 h-5" />
            <span>Upload Documents</span>
          </button>
          <button className="flex items-center space-x-3 p-5 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-200 cursor-pointer font-medium">
            <Settings className="w-5 h-5" />
            <span>Update Profile</span>
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-zinc-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900">
            Performance Overview
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <h4 className="font-semibold text-zinc-900 mb-2">
              Engagement Trend
            </h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-zinc-600 font-medium">
                +12% this week
              </span>
            </div>
          </div>
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <h4 className="font-semibold text-zinc-900 mb-2">
              Best Performing Time
            </h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-zinc-600 font-medium">
                Tuesday 9:00 AM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <h3 className="text-xl font-semibold text-zinc-900 mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {posts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-5 border border-zinc-200/80 rounded-xl hover:bg-zinc-50/80 transition-all duration-200"
            >
              <div className="flex-1">
                <p className="text-zinc-900 font-medium truncate leading-relaxed">
                  {post.content.substring(0, 60)}...
                </p>
                <p className="text-sm text-zinc-500 font-medium mt-1">
                  {post.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    post.status === "published"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {post.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-zinc-400" />
            </div>
            <p className="text-zinc-600 font-medium">No posts created yet</p>
            <p className="text-sm text-zinc-500 mt-1">
              Start creating your first LinkedIn post
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
