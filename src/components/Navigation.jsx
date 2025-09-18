import { BarChart3, Crown, LogOut, Menu, Shield, X } from "lucide-react";
import React, { useState } from "react";
import LogoutConfirmation from "./LogoutConfirmation";

const Navigation = ({
  user,
  currentView,
  setCurrentView,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onLogout,
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) return null;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "pricing", label: "Pricing", icon: Crown },
  ];

  if (user.isAdmin) {
    navItems.push({ id: "admin", label: "Admin", icon: Shield });
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // Generate fallback avatar URL if none provided
  const avatarUrl =
    user.avatar ||
    user.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User"
    )}&background=6366f1&color=ffffff`;

  // Get subscription badge styling
  const getSubscriptionBadge = () => {
    const subscription = user?.subscription || "free";
    const badgeStyles = {
      free: "bg-zinc-100 text-zinc-700 border-zinc-200",
      standard: "bg-blue-100 text-blue-700 border-blue-200",
      premium: "bg-amber-100 text-amber-700 border-amber-200",
    };

    return {
      label: subscription.charAt(0).toUpperCase() + subscription.slice(1),
      style: badgeStyles[subscription] || badgeStyles.free,
    };
  };

  const subscriptionBadge = getSubscriptionBadge();

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-sm border-b border-zinc-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">TL</span>
                </div>
                <span className="text-xl font-bold text-zinc-900">
                  ThoughtLeader AI
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer font-medium ${
                    currentView === item.id
                      ? "bg-zinc-100 text-zinc-900 shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-zinc-200">
                {/* Subscription Badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${subscriptionBadge.style}`}
                >
                  {subscriptionBadge.label}
                </div>

                <img
                  src={avatarUrl}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full border-2 border-zinc-200 bg-zinc-100"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || "User"
                    )}&background=6366f1&color=ffffff`;
                  }}
                />
                <span className="text-sm font-semibold text-zinc-700">
                  {user.name || user.displayName || "User"}
                </span>
                <button
                  onClick={handleLogoutClick}
                  className="text-zinc-500 hover:text-zinc-700 p-2 rounded-xl hover:bg-zinc-100 transition-all duration-200 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-zinc-200 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    currentView === item.id
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="flex items-center space-x-3 px-4 py-3 border-t border-zinc-100 mt-4 pt-4">
                <img
                  src={avatarUrl}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full border-2 border-zinc-200 bg-zinc-100"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || "User"
                    )}&background=6366f1&color=ffffff`;
                  }}
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-700">
                    {user.name || user.displayName || "User"}
                  </div>
                  <div
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border mt-1 ${subscriptionBadge.style}`}
                  >
                    {subscriptionBadge.label}
                  </div>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="text-zinc-500 hover:text-zinc-700 p-2 rounded-xl hover:bg-zinc-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        userName={user.name || user.displayName || "User"}
      />
    </>
  );
};

export default Navigation;
