import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { profileService } from "../../services/profileService";

const SettingsTab = ({ user, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [profileData, setProfileData] = useState({
    linkedinUrl: user?.linkedinUrl || "",
    goals: user?.goals || "",
    voiceStyle: user?.voiceStyle || "",
    topics: user?.topics || [],
  });

  const [emailSettings, setEmailSettings] = useState({
    deliveryTime: user?.emailSettings?.deliveryTime || "09:00",
    timezone: user?.emailSettings?.timezone || "America/New_York",
    format: user?.emailSettings?.format || "html",
  });

  const [scheduleSettings, setScheduleSettings] = useState({
    frequency: user?.postFrequency || "weekly",
    pauseOnHolidays: true,
    maxPostsPerMonth:
      user?.subscription === "free"
        ? 5
        : user?.subscription === "standard"
        ? 25
        : 100,
  });

  const handleProfileSave = async () => {
    setIsLoading(true);
    setError(null);
    setSaveStatus(null);

    try {
      await profileService.updateProfile(user?.uid || user?.id, profileData);
      setSaveStatus("Profile updated successfully!");

      // Refresh user data in parent component
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSettingsSave = async () => {
    setIsLoading(true);
    setError(null);
    setSaveStatus(null);

    try {
      await profileService.updateProfile(user?.uid || user?.id, {
        emailSettings: emailSettings,
      });
      setSaveStatus("Email settings updated successfully!");

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Error updating email settings:", error);
      setError("Failed to update email settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleSettingsSave = async () => {
    setIsLoading(true);
    setError(null);
    setSaveStatus(null);

    try {
      // Only save the holiday settings since frequency is determined by plan
      await profileService.updateProfile(user?.uid || user?.id, {
        pauseOnHolidays: scheduleSettings.pauseOnHolidays,
      });
      setSaveStatus("Holiday settings updated successfully!");

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Error updating holiday settings:", error);
      setError("Failed to update holiday settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSaveStatus(null);

    try {
      // Process documents and update profile with new context (replacing existing)
      const result = await profileService.processDocuments(files);

      // Update user profile with new document context
      await profileService.updateProfile(user?.uid || user?.id, {
        documentContext: result.documentContext,
      });

      setSaveStatus(
        `Documents uploaded successfully! Processed ${result.processedFiles} files with ${result.totalCharacters} characters of context.`
      );

      // Refresh user data to show updated document context
      if (onRefresh) {
        await onRefresh();
      }

      // Clear the file input
      event.target.value = "";
    } catch (error) {
      console.error("Error uploading documents:", error);
      setError("Failed to upload documents. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Update subscription to free plan
      await profileService.upgradeSubscription(user?.uid || user?.id, "free");
      setSaveStatus(
        "Subscription cancelled successfully. You're now on the free plan."
      );
      setShowCancelModal(false);

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      setError("Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // This would typically call a delete account API endpoint
      // For now, we'll just show a message
      setError(
        "Account deletion is not implemented yet. Please contact support."
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const voiceOptions = [
    { value: "professional", label: "Professional" },
    { value: "conversational", label: "Conversational" },
    { value: "thought-provoking", label: "Thought-Provoking" },
    { value: "storytelling", label: "Storytelling" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-zinc-900">Settings</h3>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {saveStatus && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-emerald-700 font-medium">{saveStatus}</p>
          </div>
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-zinc-100 rounded-xl">
            <User className="w-5 h-5 text-zinc-600" />
          </div>
          <h4 className="text-lg font-semibold text-zinc-900">
            Profile Settings
          </h4>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-3">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={profileData.linkedinUrl}
              onChange={(e) =>
                setProfileData({ ...profileData, linkedinUrl: e.target.value })
              }
              className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200 bg-white font-medium text-zinc-900"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-3">
              Content Goals
            </label>
            <textarea
              value={profileData.goals}
              onChange={(e) =>
                setProfileData({ ...profileData, goals: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent resize-none transition-all duration-200 bg-white font-medium text-zinc-900"
              placeholder="Describe your content objectives and target audience..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-3">
              Voice Style
            </label>
            <select
              value={profileData.voiceStyle}
              onChange={(e) =>
                setProfileData({ ...profileData, voiceStyle: e.target.value })
              }
              className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200 bg-white font-medium text-zinc-900"
            >
              <option value="">Select voice style</option>
              {voiceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleProfileSave}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-200 cursor-pointer font-medium disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Profile Changes</span>
          </button>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-zinc-100 rounded-xl">
            <Mail className="w-5 h-5 text-zinc-600" />
          </div>
          <h4 className="text-lg font-semibold text-zinc-900">
            Email Delivery Settings
          </h4>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-zinc-50 font-medium text-zinc-600"
              placeholder="your.email@example.com"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Email address cannot be changed here
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-3">
                Delivery Time
              </label>
              <input
                type="time"
                value={emailSettings.deliveryTime}
                onChange={(e) =>
                  setEmailSettings({
                    ...emailSettings,
                    deliveryTime: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200 bg-white font-medium text-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-3">
                Time Zone
              </label>
              <select
                value={emailSettings.timezone}
                onChange={(e) =>
                  setEmailSettings({
                    ...emailSettings,
                    timezone: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200 bg-white font-medium text-zinc-900"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">GMT</option>
                <option value="Europe/Paris">Central European Time</option>
                <option value="Asia/Tokyo">Japan Standard Time</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-3">
              Email Format
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="emailFormat"
                  value="html"
                  checked={emailSettings.format === "html"}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      format: e.target.value,
                    })
                  }
                  className="text-zinc-600"
                />
                <span className="text-sm text-zinc-700">
                  HTML with preview (Recommended)
                </span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="emailFormat"
                  value="text"
                  checked={emailSettings.format === "text"}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      format: e.target.value,
                    })
                  }
                  className="text-zinc-600"
                />
                <span className="text-sm text-zinc-700">Plain text only</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleEmailSettingsSave}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-200 cursor-pointer font-medium disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Email Settings</span>
          </button>
        </div>
      </div>

      {/* Schedule Settings */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-zinc-100 rounded-xl">
            <Clock className="w-5 h-5 text-zinc-600" />
          </div>
          <h4 className="text-lg font-semibold text-zinc-900">
            Automation Schedule
          </h4>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-3">
              Post Frequency
            </label>
            <div className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-zinc-50 font-medium text-zinc-600">
              {user?.subscription === "free"
                ? "Monthly (1 delivery per month)"
                : user?.subscription === "standard"
                ? "Weekly (1 delivery per week)"
                : "Daily (1 delivery per day)"}
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Frequency is determined by your {user?.subscription || "free"}{" "}
              plan. Upgrade to change frequency.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={scheduleSettings.pauseOnHolidays}
                onChange={(e) =>
                  setScheduleSettings({
                    ...scheduleSettings,
                    pauseOnHolidays: e.target.checked,
                  })
                }
                className="text-zinc-600"
              />
              <span className="text-sm text-zinc-700">
                Pause on major holidays
              </span>
            </label>
          </div>

          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <h5 className="font-semibold text-zinc-900 mb-2">
              Current Plan Limits
            </h5>
            <p className="text-sm text-zinc-600">
              <span className="font-medium">Deliveries per month:</span>{" "}
              {user?.subscription === "free"
                ? "1 delivery (2 posts total)"
                : user?.subscription === "standard"
                ? "4 deliveries (8 posts total)"
                : "30 deliveries (60 posts total)"}
            </p>
            <p className="text-sm text-zinc-600 mt-1">
              <span className="font-medium">Current plan:</span>{" "}
              <span className="capitalize">{user?.subscription || "Free"}</span>
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              Each delivery includes 1 short post + 1 long post
            </p>
          </div>

          <button
            onClick={handleScheduleSettingsSave}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-200 cursor-pointer font-medium disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Holiday Settings</span>
          </button>
        </div>
      </div>

      {/* Subscription Management */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-zinc-100 rounded-xl">
            <CreditCard className="w-5 h-5 text-zinc-600" />
          </div>
          <h4 className="text-lg font-semibold text-zinc-900">Subscription</h4>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
          <div>
            <p className="font-semibold text-zinc-900 capitalize text-lg">
              {user?.subscription || "Free"} Plan
            </p>
            <p className="text-sm text-zinc-600 font-medium mt-1">
              {user?.subscription === "free"
                ? "1 delivery per month (2 posts total)"
                : user?.subscription === "standard"
                ? "1 delivery per week (8 posts per month)"
                : "1 delivery per day (60 posts per month)"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Each delivery includes 1 short + 1 long post
            </p>
          </div>
          <div className="flex space-x-3">
            {user?.subscription !== "free" && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all duration-200 cursor-pointer font-medium border border-red-200"
              >
                Cancel Subscription
              </button>
            )}
            <button className="px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-200 cursor-pointer font-medium">
              {user?.subscription === "free" ? "Upgrade Plan" : "Change Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Document Management */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-zinc-100 rounded-xl">
            <FileText className="w-5 h-5 text-zinc-600" />
          </div>
          <h4 className="text-lg font-semibold text-zinc-900">
            Content Context Documents
          </h4>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            Upload documents to provide additional context for AI content
            generation. New uploads will replace existing documents.
          </p>

          <div className="border-2 border-dashed border-zinc-300 rounded-xl p-8 text-center hover:border-zinc-400 transition-all duration-200 cursor-pointer hover:bg-zinc-50/50">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-zinc-400" />
              )}
            </div>
            <p className="text-zinc-700 font-medium mb-2">
              {isUploading ? "Uploading documents..." : "Upload new documents"}
            </p>
            <p className="text-sm text-zinc-500 font-medium mb-4">
              PDF, DOCX, TXT up to 10MB each
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.txt,.docx"
              onChange={handleDocumentUpload}
              disabled={isUploading}
              className="hidden"
              id="document-upload"
            />
            <label
              htmlFor="document-upload"
              className={`inline-block px-6 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors font-medium cursor-pointer ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Choose Files
            </label>
          </div>

          {user?.documentContext && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <p className="text-sm font-semibold text-emerald-800">
                  Documents uploaded successfully
                </p>
              </div>
              <p className="text-sm text-emerald-700">
                {Math.floor(user.documentContext.length / 100)} characters of
                context available for content generation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-zinc-100 rounded-xl">
            <Bell className="w-5 h-5 text-zinc-600" />
          </div>
          <h4 className="text-lg font-semibold text-zinc-900">Notifications</h4>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-900">
                Post generation notifications
              </p>
              <p className="text-sm text-zinc-600">
                Get notified when new posts are generated
              </p>
            </div>
            <input type="checkbox" defaultChecked className="text-zinc-600" />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-900">Weekly summary emails</p>
              <p className="text-sm text-zinc-600">
                Receive weekly reports on generated content
              </p>
            </div>
            <input type="checkbox" defaultChecked className="text-zinc-600" />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-900">
                System maintenance alerts
              </p>
              <p className="text-sm text-zinc-600">
                Important updates about the service
              </p>
            </div>
            <input type="checkbox" defaultChecked className="text-zinc-600" />
          </label>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <h4 className="text-lg font-semibold text-zinc-900 mb-6">
          Account Actions
        </h4>

        <div className="space-y-3">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors text-left font-medium border border-red-200 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-semibold text-zinc-900">
                Cancel Subscription
              </h3>
            </div>

            <p className="text-zinc-600 mb-6">
              Are you sure you want to cancel your subscription? You'll be moved
              to the free plan and lose access to premium features.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 font-medium"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Cancel Subscription"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-semibold text-zinc-900">
                Delete Account
              </h3>
            </div>

            <p className="text-zinc-600 mb-6">
              This action cannot be undone. All your data, posts, and settings
              will be permanently deleted.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
