import { Calendar, Crown, FileText, Mail, Target, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { profileService } from "../../services/profileService";
import EnhancedPostGenerator from "./EnhancedPostGenerator";
import TrendsDashboard from "./TrendsDashboard";

const AutomationTab = ({ user, posts, onRefresh, setCurrentView }) => {
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [includeTrends, setIncludeTrends] = useState(true);
  const [scheduleSettings, setScheduleSettings] = useState({
    frequency: user?.postFrequency || "weekly",
    deliveryTime: user?.emailSettings?.deliveryTime || "09:00",
    timezone: user?.emailSettings?.timezone || "America/New_York",
  });

  // Load subscription info on component mount
  useEffect(() => {
    if (user?.uid || user?.id) {
      loadSubscriptionInfo();
    }
  }, [user]);

  const loadSubscriptionInfo = async () => {
    try {
      const info = await profileService.getSubscriptionInfo(
        user?.uid || user?.id
      );
      const actualSubscription = user?.subscription || "free";
      setSubscriptionInfo({
        ...info,
        subscription: actualSubscription,
      });
    } catch (error) {
      console.error("Error loading subscription info:", error);
    }
  };

  const getPostsLeft = () => {
    if (!subscriptionInfo) return 0;

    const actualSubscription = user?.subscription || "free";
    const limits = {
      free: 2,
      standard: 8,
      pro: 60,
    };

    const limit = limits[actualSubscription] || 2;
    return Math.max(0, limit - subscriptionInfo.postsUsed);
  };

  const handleUpgradePlan = () => {
    if (setCurrentView) {
      setCurrentView("pricing");
    }
  };

  const handlePostGenerated = (result) => {
    // Refresh subscription info after post generation
    loadSubscriptionInfo();

    // Refresh posts if callback provided
    if (onRefresh) {
      onRefresh();
    }
  };

  const actualSubscription = user?.subscription || "free";

  const stats = [
    {
      label: "Posts This Month",
      value: subscriptionInfo?.postsUsed?.toString() || "0",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Posts Remaining",
      value: getPostsLeft().toString(),
      icon: Target,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Plan",
      value:
        actualSubscription.charAt(0).toUpperCase() +
        actualSubscription.slice(1),
      icon: Crown,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Trends Dashboard Component */}
      <TrendsDashboard
        user={user}
        includeTrends={includeTrends}
        setIncludeTrends={setIncludeTrends}
      />

      {/* Automation Schedule Info */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-zinc-100 rounded-xl">
            <Zap className="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-zinc-900">
              Automation Schedule
            </h3>
            <p className="text-sm text-zinc-600 font-medium">
              {includeTrends
                ? "AI-powered LinkedIn posts with real-time trend integration"
                : "AI-powered LinkedIn post generation and email delivery"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200">
            <div className="flex items-center space-x-3 mb-3">
              <Calendar className="w-5 h-5 text-zinc-600" />
              <h4 className="font-semibold text-zinc-900">Schedule</h4>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-zinc-600">
                <span className="font-medium">Frequency:</span>{" "}
                {actualSubscription === "free"
                  ? "Monthly"
                  : actualSubscription === "standard"
                  ? "Weekly"
                  : "Daily"}
              </p>
              <p className="text-sm text-zinc-600">
                <span className="font-medium">Trends integration:</span>{" "}
                {includeTrends ? "Enabled" : "Disabled"}
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                Frequency based on your {actualSubscription} plan
              </p>
            </div>
          </div>

          <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200">
            <div className="flex items-center space-x-3 mb-3">
              <Mail className="w-5 h-5 text-zinc-600" />
              <h4 className="font-semibold text-zinc-900">Email Delivery</h4>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-zinc-600">
                <span className="font-medium">Email:</span>{" "}
                {user?.email || "Not set"}
              </p>
              <p className="text-sm text-zinc-600">
                <span className="font-medium">Format:</span> HTML with preview
              </p>
              <p className="text-sm text-zinc-600">
                <span className="font-medium">Delivery:</span>{" "}
                {scheduleSettings.deliveryTime} your time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Post Generator Component */}
      <EnhancedPostGenerator
        user={user}
        includeTrends={includeTrends}
        onPostGenerated={handlePostGenerated}
      />

      {/* Plan Limit Warning */}
      {getPostsLeft() <= 1 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Crown className="w-6 h-6 text-amber-600 mt-1" />
            <div>
              <h4 className="font-semibold text-amber-900 mb-2">
                {getPostsLeft() === 0
                  ? "Monthly limit reached"
                  : "Almost at monthly limit"}
              </h4>
              <p className="text-sm text-amber-700 mb-4">
                {getPostsLeft() === 0
                  ? "You've used all your posts for this month. Upgrade to continue generating trend-aware content."
                  : `You have ${getPostsLeft()} post${
                      getPostsLeft() === 1 ? "" : "s"
                    } remaining this month.`}
              </p>
              <button
                onClick={handleUpgradePlan}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Profile Summary */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <h3 className="text-xl font-semibold text-zinc-900 mb-6">
          Content Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 mb-2">
                Content Goals
              </h4>
              <p className="text-sm text-zinc-600 bg-zinc-50 p-3 rounded-lg">
                {user?.goals || "No goals set yet"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 mb-2">
                Voice Style
              </h4>
              <p className="text-sm text-zinc-600 bg-zinc-50 p-3 rounded-lg capitalize">
                {user?.voiceStyle?.replace("-", " ") || "Not selected"}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 mb-2">
                Topics & Industries
              </h4>
              <div className="flex flex-wrap gap-2">
                {user?.topics?.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
                {(!user?.topics || user.topics.length === 0) && (
                  <span className="text-sm text-zinc-500 italic">
                    No topics selected
                  </span>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 mb-2">
                Document Context
              </h4>
              <p className="text-sm text-zinc-600 bg-zinc-50 p-3 rounded-lg">
                {user?.documentContext
                  ? `${Math.floor(
                      user.documentContext.length / 100
                    )} characters of context available`
                  : "No documents uploaded"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Generated Posts Preview */}
      {posts && posts.length > 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
          <h3 className="text-xl font-semibold text-zinc-900 mb-6">
            Recent Generated Posts
          </h3>
          <div className="space-y-4">
            {posts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between p-5 border border-zinc-200/80 rounded-xl hover:bg-zinc-50/80 transition-all duration-200"
              >
                <div className="flex-1">
                  <p className="text-zinc-900 font-medium leading-relaxed">
                    {post.content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <p className="text-sm text-zinc-500 font-medium">
                      Generated: {post.createdAt.toLocaleDateString()}
                    </p>
                    <span className="text-xs text-zinc-400">•</span>
                    <p className="text-sm text-zinc-500 font-medium">
                      {post.includedTrends ? "Trend-aware" : "Standard"}
                    </p>
                  </div>
                </div>
                <button className="ml-4 px-3 py-1.5 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors font-medium">
                  Preview
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-zinc-200/60 shadow-xl shadow-zinc-200/50 text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            Automation Ready
          </h3>
          <p className="text-zinc-600 font-medium mb-4">
            Your AI content generation is set up and ready to create
            {includeTrends ? " trend-aware" : ""} posts automatically.
          </p>
          <p className="text-sm text-zinc-500">
            Posts will be generated based on your profile
            {includeTrends ? " and current industry trends" : ""} and emailed to
            you according to your {actualSubscription} plan schedule.
          </p>
        </div>
      )}
    </div>
  );
};

export default AutomationTab;
