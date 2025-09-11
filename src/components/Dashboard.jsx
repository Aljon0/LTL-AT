import { BarChart3, FileText, MessageCircle, Settings } from "lucide-react";
import React, { useState } from "react";
import FeedbackTab from "./DashboardTabs/FeedbackTab";
import OverviewTab from "./DashboardTabs/OverviewTab";
import PostHistoryTab from "./DashboardTabs/PostHistoryTab";
import SettingsTab from "./DashboardTabs/SettingsTab";

const Dashboard = ({ user, posts }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "posts", label: "Post History", icon: FileText },
    { id: "feedback", label: "Feedback", icon: MessageCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Dashboard</h1>
          <p className="text-zinc-600 font-medium">
            Manage your LinkedIn content and track performance
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 border cursor-pointer border-zinc-200/60 inline-flex shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer font-medium ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-zinc-800 to-zinc-900 text-white shadow-lg"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === "overview" && (
            <OverviewTab user={user} posts={posts} />
          )}
          {activeTab === "posts" && <PostHistoryTab posts={posts} />}
          {activeTab === "feedback" && <FeedbackTab posts={posts} />}
          {activeTab === "settings" && <SettingsTab user={user} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
