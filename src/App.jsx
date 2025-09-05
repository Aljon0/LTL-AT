import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import Dashboard from "./components/Dashboard";
import LinkedInCallback from "./components/LinkedInCallback";
import LoginPage from "./components/LoginPage";
import Navigation from "./components/Navigation";
import OnboardingFlow from "./components/OnboardingFlow";
import PricingPage from "./components/PricingPage";
import { auth, signOutUser } from "./lib/firebase";
import { AuthService } from "./services/authService.js";

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        <span className="text-white font-bold text-2xl">TL</span>
      </div>
      <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-700 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-zinc-600 font-medium">Loading ThoughtLeader AI...</p>
    </div>
  </div>
);

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState("login");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const authService = AuthService.getInstance();

  // Check if we're on the LinkedIn callback page
  const isLinkedInCallback =
    window.location.pathname === "/auth/linkedin/callback";

  // Sample data
  useEffect(() => {
    setPosts([
      {
        id: "1",
        content:
          "The future of AI in business is not about replacing humans, but augmenting human capabilities...",
        createdAt: new Date("2025-08-28"),
        status: "published",
        feedback: "up",
        engagement: 127,
      },
      {
        id: "2",
        content:
          "Three key lessons from scaling a SaaS startup from 0 to $1M ARR...",
        createdAt: new Date("2025-08-25"),
        status: "published",
        feedback: "up",
        engagement: 89,
      },
    ]);
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    // Check for LinkedIn auth data in sessionStorage (in case popup closed unexpectedly)
    const linkedInAuthData = sessionStorage.getItem("linkedin_auth_result");
    if (linkedInAuthData) {
      try {
        const userData = JSON.parse(linkedInAuthData);
        sessionStorage.removeItem("linkedin_auth_result");
        handleLogin(userData);
        return;
      } catch (e) {
        console.error("Error parsing LinkedIn auth data:", e);
      }
    }

    // Skip auth listener if we're on LinkedIn callback page
    if (isLinkedInCallback) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);

      if (firebaseUser) {
        try {
          // Get user profile from your backend
          const idToken = await firebaseUser.getIdToken();
          let userData = await authService.getUserProfile(
            firebaseUser.uid,
            idToken
          );

          // If user doesn't exist in backend, create them
          if (!userData) {
            userData = await authService.createOrUpdateUser(firebaseUser);
          }

          setUser(userData);

          // Check if user has completed onboarding (you can store this in your backend)
          const onboardingComplete = localStorage.getItem(
            `onboarding_${firebaseUser.uid}`
          );
          setHasCompletedOnboarding(!!onboardingComplete);

          if (onboardingComplete) {
            setCurrentView("dashboard");
          } else {
            setCurrentView("onboarding");
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
          // Handle error - maybe show error message or logout
        }
      } else {
        setUser(null);
        setCurrentView("login");
        setHasCompletedOnboarding(false);
      }

      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [authService, isLinkedInCallback]);

  const handleLogin = (userData) => {
    setUser(userData);
    // Check onboarding status
    const onboardingComplete = localStorage.getItem(
      `onboarding_${userData.id}`
    );
    if (onboardingComplete) {
      setCurrentView("dashboard");
      setHasCompletedOnboarding(true);
    } else {
      setCurrentView("onboarding");
    }
  };

  const handleOnboardingComplete = () => {
    if (user) {
      localStorage.setItem(`onboarding_${user.id}`, "true");
      setHasCompletedOnboarding(true);
    }
    setCurrentView("dashboard");
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setCurrentView("login");
      setIsMobileMenuOpen(false);
      setHasCompletedOnboarding(false);

      // Clear local storage
      if (user) {
        localStorage.removeItem(`onboarding_${user.id}`);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle LinkedIn callback
  if (isLinkedInCallback) {
    return <LinkedInCallback />;
  }

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show login page if no user
  if (!user && currentView === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onLogout={handleLogout}
      />

      <main className="transition-all duration-300">
        {currentView === "onboarding" && !hasCompletedOnboarding && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}
        {currentView === "pricing" && <PricingPage />}
        {currentView === "dashboard" && <Dashboard user={user} posts={posts} />}
        {currentView === "admin" && user?.isAdmin && (
          <AdminPanel posts={posts} />
        )}
      </main>
    </div>
  );
};

export default App;
