import {
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  FileText,
  Loader2,
  Mail,
  Pause,
  Play,
  Send,
  Settings,
  Target,
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { profileService } from "../../services/profileService";

const AutomationTab = ({ user, posts, onRefresh, setCurrentView }) => {
  const [automationStatus, setAutomationStatus] = useState("active");
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [testEmailStatus, setTestEmailStatus] = useState(null);
  const [error, setError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
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
      setSubscriptionInfo(info);
    } catch (error) {
      console.error("Error loading subscription info:", error);
    }
  };

  // Calculate posts left based on subscription
  const getPostsLeft = () => {
    if (!subscriptionInfo) return 0;
    return Math.max(
      0,
      subscriptionInfo.postsLimit - subscriptionInfo.postsUsed
    );
  };

  const getNextPostDate = () => {
    const frequency = scheduleSettings.frequency;
    const nextDate = new Date();

    switch (frequency) {
      case "daily":
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      default:
        nextDate.setDate(nextDate.getDate() + 7);
    }

    return nextDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleScheduleUpdate = async () => {
    setIsLoading(true);
    try {
      await profileService.updateAutomationSettings(user?.uid || user?.id, {
        status: automationStatus,
        frequency: scheduleSettings.frequency,
        emailSettings: {
          deliveryTime: scheduleSettings.deliveryTime,
          timezone: scheduleSettings.timezone,
          format: "html",
        },
      });

      setShowScheduleModal(false);
      // Trigger a refresh to update user data
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      setError("Failed to update schedule settings");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutomation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newStatus = automationStatus === "active" ? "paused" : "active";

      await profileService.updateAutomationSettings(user?.uid || user?.id, {
        status: newStatus,
        frequency: scheduleSettings.frequency,
        emailSettings: {
          deliveryTime: scheduleSettings.deliveryTime,
          timezone: scheduleSettings.timezone,
          format: "html",
        },
      });

      setAutomationStatus(newStatus);
    } catch (error) {
      console.error("Error toggling automation:", error);
      setError("Failed to update automation status");
    } finally {
      setIsLoading(false);
    }
  };

  const generateTestPost = async () => {
    setIsLoading(true);
    setError(null);
    setTestEmailStatus(null);

    try {
      // Check if user has posts left
      if (getPostsLeft() <= 0) {
        setError(
          "You have reached your monthly post limit. Please upgrade your plan."
        );
        return;
      }

      // Generate a test post
      const testPrompt =
        "Create a test LinkedIn post based on my profile and interests";
      const result = await profileService.generatePost(
        user?.uid || user?.id,
        testPrompt,
        "This is a test post to preview the automated content generation"
      );

      // Send test email with the generated post
      await profileService.sendTestEmail(
        user?.uid || user?.id,
        result.post,
        user?.email
      );

      setTestEmailStatus("success");

      // Refresh subscription info to update post count
      await loadSubscriptionInfo();
    } catch (error) {
      console.error("Error generating test post:", error);
      setError(error.message || "Failed to generate test post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradePlan = () => {
    if (setCurrentView) {
      setCurrentView("pricing");
    }
  };

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
      label: "Next Post",
      value: automationStatus === "active" ? "Tomorrow" : "Paused",
      icon: Clock,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      label: "Plan",
      value: subscriptionInfo?.subscription || "Free",
      icon: Crown,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const timezoneOptions = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  ];

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {testEmailStatus === "success" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-emerald-700 font-medium">
              Test post generated and sent to your email successfully!
            </p>
          </div>
        </div>
      )}

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

      {/* Automation Control */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-zinc-100 rounded-xl">
              <Zap className="w-5 h-5 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900">
                Content Automation
              </h3>
              <p className="text-sm text-zinc-600 font-medium">
                AI-powered LinkedIn post generation and email delivery
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                automationStatus === "active"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  automationStatus === "active"
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              ></div>
              <span className="capitalize">{automationStatus}</span>
            </div>

            <button
              onClick={toggleAutomation}
              disabled={isLoading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 ${
                automationStatus === "active"
                  ? "bg-amber-100 hover:bg-amber-200 text-amber-700"
                  : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : automationStatus === "active" ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Automation Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200">
            <div className="flex items-center space-x-3 mb-3">
              <Calendar className="w-5 h-5 text-zinc-600" />
              <h4 className="font-semibold text-zinc-900">Schedule</h4>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-zinc-600">
                <span className="font-medium">Frequency:</span>{" "}
                {scheduleSettings.frequency.charAt(0).toUpperCase() +
                  scheduleSettings.frequency.slice(1)}
              </p>
              <p className="text-sm text-zinc-600">
                <span className="font-medium">Next post:</span>{" "}
                {getNextPostDate()}
              </p>
              <p className="text-sm text-zinc-600">
                <span className="font-medium">Time zone:</span>{" "}
                {scheduleSettings.timezone.replace("_", " ")}
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

      {/* Quick Actions */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <h3 className="text-xl font-semibold text-zinc-900 mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={generateTestPost}
            disabled={isLoading || getPostsLeft() <= 0}
            className="flex items-center space-x-3 p-5 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:from-zinc-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>Generate Test Post</span>
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center space-x-3 p-5 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-200 cursor-pointer font-medium"
          >
            <Settings className="w-5 h-5" />
            <span>Edit Schedule</span>
          </button>
          <button
            onClick={handleUpgradePlan}
            className="flex items-center space-x-3 p-5 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-200 cursor-pointer font-medium"
          >
            <Crown className="w-5 h-5" />
            <span>Upgrade Plan</span>
          </button>
        </div>
      </div>

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
                  ? "You've used all your posts for this month. Upgrade to continue generating content."
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
      {posts && posts.length > 0 && (
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
                      Status: Ready for email
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
      )}

      {/* Empty State */}
      {(!posts || posts.length === 0) && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-zinc-200/60 shadow-xl shadow-zinc-200/50 text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            Automation Ready
          </h3>
          <p className="text-zinc-600 font-medium mb-4">
            Your AI content generation is set up and ready to start creating
            posts automatically.
          </p>
          <p className="text-sm text-zinc-500">
            Posts will be generated based on your profile and emailed to you
            according to your schedule.
          </p>
        </div>
      )}

      {/* Schedule Settings Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-zinc-900">
                Edit Schedule Settings
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-zinc-100 rounded-lg"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-900 mb-2">
                  Post Frequency
                </label>
                <select
                  value={scheduleSettings.frequency}
                  onChange={(e) =>
                    setScheduleSettings((prev) => ({
                      ...prev,
                      frequency: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                >
                  {frequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900 mb-2">
                  Delivery Time
                </label>
                <input
                  type="time"
                  value={scheduleSettings.deliveryTime}
                  onChange={(e) =>
                    setScheduleSettings((prev) => ({
                      ...prev,
                      deliveryTime: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900 mb-2">
                  Timezone
                </label>
                <select
                  value={scheduleSettings.timezone}
                  onChange={(e) =>
                    setScheduleSettings((prev) => ({
                      ...prev,
                      timezone: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                >
                  {timezoneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleUpdate}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-900 font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationTab;
