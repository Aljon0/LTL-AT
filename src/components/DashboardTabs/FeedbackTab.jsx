import { Target, ThumbsDown, ThumbsUp } from "lucide-react";
import React from "react";

const FeedbackTab = ({ posts }) => {
  const feedbackPosts = posts.filter((post) => post.feedback);
  const positiveCount = feedbackPosts.filter(
    (post) => post.feedback === "up"
  ).length;
  const negativeCount = feedbackPosts.filter(
    (post) => post.feedback === "down"
  ).length;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-zinc-900">Feedback Summary</h3>

      {/* Feedback Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <ThumbsUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">
                {positiveCount}
              </p>
              <p className="text-sm text-zinc-600 font-medium">
                Positive Feedback
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 rounded-xl">
              <ThumbsDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">
                {negativeCount}
              </p>
              <p className="text-sm text-zinc-600 font-medium">
                Needs Improvement
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-violet-50 rounded-xl">
              <Target className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">
                {feedbackPosts.length > 0
                  ? Math.round((positiveCount / feedbackPosts.length) * 100)
                  : 0}
                %
              </p>
              <p className="text-sm text-zinc-600 font-medium">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback History */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <h4 className="text-lg font-semibold text-zinc-900 mb-6">
          Recent Feedback
        </h4>
        <div className="space-y-4">
          {feedbackPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-start space-x-4 p-5 border border-zinc-200/80 rounded-xl hover:bg-zinc-50/80 transition-all duration-200"
            >
              <div
                className={`p-2.5 rounded-xl ${
                  post.feedback === "up"
                    ? "bg-emerald-50 border border-emerald-100"
                    : "bg-red-50 border border-red-100"
                }`}
              >
                {post.feedback === "up" ? (
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ThumbsDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-zinc-900 leading-relaxed mb-2 font-medium">
                  {post.content.substring(0, 100)}...
                </p>
                <p className="text-sm text-zinc-500 font-medium">
                  {post.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {feedbackPosts.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-zinc-400" />
            </div>
            <p className="text-zinc-600 font-medium">
              No feedback available yet
            </p>
            <p className="text-sm text-zinc-500">
              Start posting to receive feedback on your content
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackTab;
