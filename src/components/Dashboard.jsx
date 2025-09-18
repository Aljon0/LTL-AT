import { Settings, Zap } from "lucide-react";
import React, { useState } from "react";
import AutomationTab from "./DashboardTabs/AutomationTab";
import SettingsTab from "./DashboardTabs/SettingsTab";

const Dashboard = ({ user, posts, onRefresh, setCurrentView }) => {
  const [activeTab, setActiveTab] = useState("automation");

  if (!user) return null;

  const tabs = [
    { id: "automation", label: "Automation", icon: Zap },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Dashboard</h1>
          <p className="text-zinc-600 font-medium">
            Manage your automated LinkedIn content generation
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
          {activeTab === "automation" && (
            <AutomationTab
              user={user}
              posts={posts}
              onRefresh={onRefresh}
              setCurrentView={setCurrentView}
            />
          )}
          {activeTab === "settings" && (
            <SettingsTab user={user} onRefresh={onRefresh} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
