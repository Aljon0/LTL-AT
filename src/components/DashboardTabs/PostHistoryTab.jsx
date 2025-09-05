import { ThumbsDown, ThumbsUp, Zap } from "lucide-react";
import React from "react";

const PostHistoryTab = ({ posts }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold text-zinc-900">Post History</h3>
      <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
        <Zap className="w-4 h-4" />
        <span>Generate New Post</span>
      </button>
    </div>

    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:shadow-zinc-200/60 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-zinc-900 leading-relaxed font-medium">
                {post.content}
              </p>
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                  post.status === "published"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {post.status}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-200/80">
            <div className="flex items-center space-x-4 text-sm text-zinc-600 font-medium">
              <span>{post.createdAt.toLocaleDateString()}</span>
              {post.engagement && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-zinc-300 rounded-full"></div>
                  <span>{post.engagement} engagements</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {post.feedback === "up" && (
                <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                </div>
              )}
              {post.feedback === "down" && (
                <div className="p-1.5 bg-red-50 rounded-lg border border-red-200">
                  <ThumbsDown className="w-4 h-4 text-red-600" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {posts.length === 0 && (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-10 h-10 text-zinc-400" />
        </div>
        <h4 className="text-lg font-semibold text-zinc-900 mb-2">
          No posts yet
        </h4>
        <p className="text-zinc-600 mb-6 max-w-sm mx-auto">
          Start creating engaging LinkedIn content with our AI-powered generator
        </p>
        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-200 cursor-pointer shadow-lg mx-auto font-medium">
          <Zap className="w-4 h-4" />
          <span>Create Your First Post</span>
        </button>
      </div>
    )}
  </div>
);

export default PostHistoryTab;
