import { AlertTriangle, X } from "lucide-react";
import React from "react";

const LogoutConfirmation = ({
  isOpen,
  onConfirm,
  onCancel,
  userName = "User",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-zinc-200/60 max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200/60">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">
              Confirm Logout
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-zinc-600 mb-2 font-medium">
            Are you sure you want to log out?
          </p>
          <p className="text-sm text-zinc-500 font-medium">
            You'll need to sign in again to access your ThoughtLeader AI
            dashboard.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 bg-zinc-50/50 rounded-b-2xl border-t border-zinc-200/60">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-zinc-700 font-medium bg-white hover:bg-zinc-50 border border-zinc-300 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
