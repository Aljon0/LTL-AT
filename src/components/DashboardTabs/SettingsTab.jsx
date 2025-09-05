import { CreditCard, FileText, Upload, User } from "lucide-react";
import React from "react";

const SettingsTab = ({ user }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-zinc-900">Settings</h3>

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
            defaultValue={user.linkedinUrl}
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200 bg-white font-medium text-zinc-900"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-3">
            Content Goals
          </label>
          <textarea
            defaultValue={user.goals}
            rows={4}
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent resize-none transition-all duration-200 bg-white font-medium text-zinc-900"
            placeholder="Describe your content objectives and target audience..."
          />
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-200 cursor-pointer font-medium">
          Save Profile Changes
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
            {user.subscription} Plan
          </p>
          <p className="text-sm text-zinc-600 font-medium mt-1">
            {user.subscription === "free"
              ? "5 posts per month"
              : user.subscription === "standard"
              ? "25 posts per month"
              : "Unlimited posts"}
          </p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-200 cursor-pointer font-medium">
          {user.subscription === "free" ? "Upgrade Plan" : "Manage Billing"}
        </button>
      </div>
    </div>

    {/* Document Management */}
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-zinc-100 rounded-xl">
          <FileText className="w-5 h-5 text-zinc-600" />
        </div>
        <h4 className="text-lg font-semibold text-zinc-900">Documents</h4>
      </div>

      <div className="border-2 border-dashed border-zinc-300 rounded-xl p-8 text-center hover:border-zinc-400 transition-all duration-200 cursor-pointer hover:bg-zinc-50/50">
        <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-zinc-400" />
        </div>
        <p className="text-zinc-700 font-medium mb-2">Upload new documents</p>
        <p className="text-sm text-zinc-500 font-medium">
          PDF, DOCX, PPTX up to 10MB each
        </p>
        <button className="mt-4 px-6 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors font-medium">
          Choose Files
        </button>
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
        <button className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors text-left font-medium border border-red-200">
          Delete Account
        </button>
      </div>
    </div>
  </div>
);

export default SettingsTab;
