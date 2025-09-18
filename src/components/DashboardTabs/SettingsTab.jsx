import {
  Bell,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  Upload,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { profileService } from "../../services/profileService";

const SettingsTab = ({ user, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [error, setError] = useState(null);

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
      await profileService.updateAutomationSettings(user?.uid || user?.id, {
        status: user?.automationStatus || "active",
        frequency: scheduleSettings.frequency,
        emailSettings: emailSettings,
      });
      setSaveStatus("Schedule settings updated successfully!");

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Error updating schedule settings:", error);
      setError("Failed to update schedule settings. Please try again.");
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
            <select
              value={scheduleSettings.frequency}
              onChange={(e) =>
                setScheduleSettings({
                  ...scheduleSettings,
                  frequency: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200 bg-white font-medium text-zinc-900"
            >
              <option value="daily">Daily</option>
              <option value="3-times-week">3 times a week</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
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
              <span className="font-medium">Max posts per month:</span>{" "}
              {scheduleSettings.maxPostsPerMonth}
            </p>
            <p className="text-sm text-zinc-600 mt-1">
              <span className="font-medium">Current plan:</span>{" "}
              {user?.subscription || "Free"}
            </p>
          </div>

          <button
            onClick={handleScheduleSettingsSave}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-200 cursor-pointer font-medium disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Schedule Settings</span>
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
                ? "5 automated posts per month"
                : user?.subscription === "standard"
                ? "25 automated posts per month"
                : "Unlimited automated posts"}
            </p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-200 cursor-pointer font-medium">
            {user?.subscription === "free" ? "Upgrade Plan" : "Manage Billing"}
          </button>
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
            generation. These help create more personalized and relevant posts.
          </p>

          <div className="border-2 border-dashed border-zinc-300 rounded-xl p-8 text-center hover:border-zinc-400 transition-all duration-200 cursor-pointer hover:bg-zinc-50/50">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-zinc-400" />
            </div>
            <p className="text-zinc-700 font-medium mb-2">
              Upload new documents
            </p>
            <p className="text-sm text-zinc-500 font-medium">
              PDF, DOCX, TXT up to 10MB each
            </p>
            <button className="mt-4 px-6 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors font-medium">
              Choose Files
            </button>
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
          <button className="w-full px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-colors text-left font-medium">
            Export My Data
          </button>
          <button className="w-full px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-colors text-left font-medium">
            Download Content History
          </button>
          <button className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors text-left font-medium border border-red-200">
            Pause All Automation
          </button>
          <button className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors text-left font-medium border border-red-200">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
