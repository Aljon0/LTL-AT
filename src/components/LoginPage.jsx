import { Linkedin, LogIn } from "lucide-react";
import React, { useState } from "react";
import { signInWithGoogle, signInWithLinkedIn } from "../lib/firebase";
import { AuthService } from "../services/authService";

const LoginPage = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);

  const authService = AuthService.getInstance();

  const handleGoogleLogin = async () => {
    setIsLoading("google");
    setError(null);

    try {
      const result = await signInWithGoogle();
      const user = await authService.createOrUpdateUser(result.user);
      onLogin(user);
    } catch (error) {
      console.error("Google login error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        setError("Login cancelled. Please try again.");
      } else if (error.code === "auth/popup-blocked") {
        setError(
          "Popup blocked. Please allow popups for this site and try again."
        );
      } else {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setIsLoading(null);
    }
  };

  const handleLinkedInLogin = async () => {
    setIsLoading("linkedin");
    setError(null);

    try {
      const result = await signInWithLinkedIn();
      const user = await authService.createOrUpdateUser(result.user);
      onLogin(user);
    } catch (error) {
      console.error("LinkedIn login error:", error);
      if (error.message === "LinkedIn login popup was closed") {
        setError("Login cancelled. Please try again.");
      } else if (error.message === "Login cancelled by user") {
        setError("Login cancelled. Please try again.");
      } else {
        setError("Failed to sign in with LinkedIn. Please try again.");
      }
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-zinc-200/60 w-full max-w-md p-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">TL</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            Welcome to ThoughtLeader AI
          </h1>
          <p className="text-zinc-600 text-sm font-medium">
            Your AI-powered content creation platform
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Login Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white hover:bg-gray-50 border border-zinc-300 rounded-xl transition-all cursor-pointer duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group font-medium"
          >
            {isLoading === "google" ? (
              <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="text-zinc-700 group-hover:text-zinc-900">
              {isLoading === "google"
                ? "Signing in..."
                : "Continue with Google"}
            </span>
          </button>

          <button
            onClick={handleLinkedInLogin}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center cursor-pointer space-x-3 px-6 py-4 bg-[#0077B5] hover:bg-[#005885] text-white rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group font-medium"
          >
            {isLoading === "linkedin" ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Linkedin className="w-5 h-5" />
            )}
            <span>
              {isLoading === "linkedin"
                ? "Signing in..."
                : "Continue with LinkedIn"}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-zinc-500 font-medium">
              Secure authentication powered by Firebase
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-zinc-600">
            <LogIn className="w-4 h-4" />
            <span className="font-medium">
              Single sign-on with your favorite platform
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-medium">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
