import {
  AlertTriangle,
  Eye,
  FileText,
  Flag,
  Shield,
  Target,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const AdminPanel = ({ posts }) => {
  const [filter, setFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  // Mock data for admin stats
  const totalUsers = 1247;
  const totalPosts = 5832;
  const flaggedPosts = 12;
  const activeUsers = 892;
  const positiveFeedback = posts.filter(
    (post) => post.feedback === "up"
  ).length;
  const negativeFeedback = posts.filter(
    (post) => post.feedback === "down"
  ).length;

  // Sample posts data with admin fields
  const adminPosts = [
    {
      id: "1",
      content:
        "The future of AI in business is not about replacing humans, but augmenting human capabilities. Here are three key areas where AI-human collaboration is creating unprecedented value...",
      createdAt: new Date("2025-08-28"),
      status: "published",
      feedback: "up",
      engagement: 127,
      userId: "user123",
      userName: "Alex Johnson",
      flagged: false,
    },
    {
      id: "2",
      content:
        "Three key lessons from scaling a SaaS startup from 0 to $1M ARR: 1) Product-market fit is everything 2) Customer feedback drives iteration 3) Team culture scales revenue...",
      createdAt: new Date("2025-08-25"),
      status: "published",
      feedback: "up",
      engagement: 89,
      userId: "user456",
      userName: "Sarah Chen",
      flagged: false,
    },
    {
      id: "3",
      content:
        'Controversial take: Most "productivity hacks" are just procrastination in disguise. Real productivity comes from deep work and saying no to everything else...',
      createdAt: new Date("2025-08-23"),
      status: "published",
      feedback: "down",
      engagement: 45,
      userId: "user789",
      userName: "Mike Rodriguez",
      flagged: true,
      flagReason: "User reported as potentially misleading",
    },
    {
      id: "4",
      content:
        "The data doesn't lie: remote work is here to stay. Companies that embrace hybrid models are seeing 23% higher employee satisfaction and 18% better retention rates...",
      createdAt: new Date("2025-08-20"),
      status: "published",
      feedback: "up",
      engagement: 203,
      userId: "user101",
      userName: "Lisa Park",
      flagged: false,
    },
    {
      id: "5",
      content:
        "Why I stopped using traditional project management tools and switched to a simple notebook. Sometimes the best technology is no technology at all...",
      createdAt: new Date("2025-08-18"),
      status: "draft",
      feedback: "down",
      engagement: 0,
      userId: "user202",
      userName: "David Kim",
      flagged: true,
      flagReason: "Multiple users reported as spam-like content",
    },
  ];

  // Filter posts based on selected filter
  const filteredPosts = adminPosts.filter((post) => {
    switch (filter) {
      case "flagged":
        return post.flagged;
      case "recent":
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return post.createdAt >= threeDaysAgo;
      case "negative-feedback":
        return post.feedback === "down";
      default:
        return true;
    }
  });

  const handleFlagPost = (postId, reason) => {
    console.log(`Flagging post ${postId} for reason: ${reason}`);
  };

  const handleDeletePost = (postId) => {
    console.log(`Deleting post ${postId}`);
  };

  const handleViewUser = (userId) => {
    console.log(`Viewing user ${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Admin Panel</h1>
          <p className="text-zinc-600 font-medium">
            Monitor content, users, and platform health
          </p>
        </div>

        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">
                  {totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-zinc-600 font-medium">Total Users</p>
                <p className="text-xs text-emerald-600 font-medium">
                  +12% this month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">
                  {totalPosts.toLocaleString()}
                </p>
                <p className="text-sm text-zinc-600 font-medium">
                  Generated Posts
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  +8% this week
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-xl">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">
                  {flaggedPosts}
                </p>
                <p className="text-sm text-zinc-600 font-medium">
                  Flagged Posts
                </p>
                <p className="text-xs text-red-600 font-medium">
                  Needs attention
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
                  {activeUsers}
                </p>
                <p className="text-sm text-zinc-600 font-medium">
                  Active Users
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  Last 7 days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <ThumbsUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-zinc-900">
                Positive Feedback
              </h4>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {positiveFeedback}
            </p>
            <p className="text-sm text-zinc-600 font-medium">
              {posts.length > 0
                ? Math.round((positiveFeedback / posts.length) * 100)
                : 0}
              % of total posts
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-50 rounded-xl">
                <ThumbsDown className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-zinc-900">
                Negative Feedback
              </h4>
            </div>
            <p className="text-3xl font-bold text-red-600">
              {negativeFeedback}
            </p>
            <p className="text-sm text-zinc-600 font-medium">
              {posts.length > 0
                ? Math.round((negativeFeedback / posts.length) * 100)
                : 0}
              % of total posts
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-50 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-zinc-900">
                Issues to Review
              </h4>
            </div>
            <p className="text-3xl font-bold text-amber-600">{flaggedPosts}</p>
            <p className="text-sm text-zinc-600 font-medium">
              Flagged content pending review
            </p>
          </div>
        </div>

        {/* Content Management Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-xl font-semibold text-zinc-900">
              Content Management
            </h3>
            <div className="flex space-x-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent bg-white font-medium"
              >
                <option value="all">All Posts ({adminPosts.length})</option>
                <option value="flagged">
                  Flagged Content ({adminPosts.filter((p) => p.flagged).length})
                </option>
                <option value="recent">Recent Posts</option>
                <option value="negative-feedback">
                  Negative Feedback ({negativeFeedback})
                </option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`border rounded-2xl p-6 transition-all hover:shadow-md ${
                  post.flagged
                    ? "border-red-200 bg-red-50/50"
                    : "border-zinc-200 hover:bg-zinc-50/50"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-zinc-900">
                        {post.userName}
                      </span>
                      <span className="text-sm text-zinc-500">•</span>
                      <span className="text-sm text-zinc-500 font-medium">
                        {post.createdAt.toLocaleDateString()}
                      </span>
                      {post.flagged && (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
                          <Flag className="w-3 h-3" />
                          <span>Flagged</span>
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          post.status === "published"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <p className="text-zinc-900 leading-relaxed mb-3 font-medium">
                      {post.content}
                    </p>

                    {post.flagged && post.flagReason && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-semibold text-red-800">
                            Flag Reason:
                          </span>
                        </div>
                        <p className="text-sm text-red-700 mt-1 font-medium">
                          {post.flagReason}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center space-x-6 text-sm text-zinc-600 font-medium">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{post.engagement || 0} engagements</span>
                      </div>
                      {post.feedback && (
                        <div className="flex items-center space-x-1">
                          {post.feedback === "up" ? (
                            <ThumbsUp className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ThumbsDown className="w-4 h-4 text-red-600" />
                          )}
                          <span
                            className={
                              post.feedback === "up"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }
                          >
                            {post.feedback === "up" ? "Positive" : "Negative"}{" "}
                            feedback
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-200">
                  <button
                    onClick={() => handleViewUser(post.userId || "")}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View User</span>
                  </button>

                  {!post.flagged ? (
                    <button
                      onClick={() => handleFlagPost(post.id, "Admin review")}
                      className="flex items-center space-x-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
                    >
                      <Flag className="w-4 h-4" />
                      <span>Flag Post</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => console.log(`Unflagging post ${post.id}`)}
                      className="flex items-center space-x-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedPost(post)}
                    className="flex items-center space-x-2 px-3 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-zinc-400" />
              </div>
              <p className="text-zinc-600 font-medium">
                No posts found for the selected filter.
              </p>
            </div>
          )}
        </div>

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-zinc-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-zinc-900">
                    Post Details
                  </h3>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-zinc-500 hover:text-zinc-700 p-2 hover:bg-zinc-100 rounded-lg transition-colors text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2">Content</h4>
                  <p className="text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-xl font-medium">
                    {selectedPost.content}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-2">User</h4>
                    <p className="text-zinc-700 font-medium">
                      {selectedPost.userName}
                    </p>
                    <p className="text-sm text-zinc-500 font-medium">
                      ID: {selectedPost.userId}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-2">
                      Metrics
                    </h4>
                    <p className="text-zinc-700 font-medium">
                      {selectedPost.engagement || 0} engagements
                    </p>
                    <p className="text-sm text-zinc-500 font-medium">
                      Status:{" "}
                      <span className="capitalize">{selectedPost.status}</span>
                    </p>
                  </div>
                </div>

                {selectedPost.flagged && selectedPost.flagReason && (
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-2">
                      Flag Details
                    </h4>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-semibold text-red-800">
                          Flagged Content
                        </span>
                      </div>
                      <p className="text-red-700 font-medium">
                        {selectedPost.flagReason}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4 border-t border-zinc-200">
                  <button
                    onClick={() => handleViewUser(selectedPost.userId || "")}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    View User Profile
                  </button>
                  {selectedPost.flagged ? (
                    <button
                      onClick={() =>
                        console.log(`Approving post ${selectedPost.id}`)
                      }
                      className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Approve Content
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleFlagPost(selectedPost.id, "Admin review")
                      }
                      className="flex-1 py-3 px-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
                    >
                      Flag for Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
