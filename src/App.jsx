import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import Navigation from "./components/Navigation";
import OnboardingFlow from "./components/OnboardingFlow";
import PaymentReceipt from "./components/PaymentReceipt";
import PricingPage from "./components/PricingPage";
import StripePayment from "./components/StripePayment";
import { auth, signOutUser } from "./lib/firebase";
import { AuthService } from "./services/authService.js";
import { profileService } from "./services/profileService";

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
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Payment flow state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const authService = AuthService.getInstance();

  // Function to check onboarding status and load user profile
  const loadUserProfile = async (userId) => {
    try {
      // Check onboarding status
      const setupStatus = await profileService.checkSetupStatus(userId);
      setHasCompletedOnboarding(setupStatus.setupCompleted);

      if (setupStatus.setupCompleted) {
        // Load full user profile
        const profileResult = await profileService.getProfile(userId);
        if (profileResult.profile) {
          setUserProfile(profileResult.profile);

          // Load user's posts
          const postsResult = await profileService.getPosts(userId);
          setPosts(postsResult.posts || []);
        }
      }

      return setupStatus.setupCompleted;
    } catch (error) {
      console.error("Error loading user profile:", error);
      return false;
    }
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
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

          // Add Firebase user properties to userData
          const enhancedUserData = {
            ...userData,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          };

          setUser(enhancedUserData);

          // Load user profile and check onboarding status
          const onboardingComplete = await loadUserProfile(firebaseUser.uid);

          if (onboardingComplete) {
            setCurrentView("dashboard");
          } else {
            setCurrentView("onboarding");
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
          setCurrentView("login");
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setPosts([]);
        setCurrentView("login");
        setHasCompletedOnboarding(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [authService]);

  const handleLogin = async (userData) => {
    setUser(userData);

    // Load user profile and check onboarding status
    try {
      const onboardingComplete = await loadUserProfile(
        userData.uid || userData.id
      );

      if (onboardingComplete) {
        setCurrentView("dashboard");
      } else {
        setCurrentView("onboarding");
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setCurrentView("onboarding");
    }
  };

  const handleOnboardingComplete = async () => {
    setHasCompletedOnboarding(true);

    // Reload user profile after onboarding completion
    if (user?.uid || user?.id) {
      await loadUserProfile(user.uid || user.id);
    }

    setCurrentView("dashboard");
  };

  const refreshUserData = async () => {
    if (user?.uid || user?.id) {
      await loadUserProfile(user.uid || user.id);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setUserProfile(null);
      setPosts([]);
      setCurrentView("login");
      setIsMobileMenuOpen(false);
      setHasCompletedOnboarding(false);
      setSelectedPlan(null);
      setPaymentData(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Payment flow handlers
  const handlePlanUpgrade = (planId) => {
    setSelectedPlan(planId);
    setCurrentView("payment");
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setPaymentData(paymentResult);

    // Update user subscription in the database
    try {
      await profileService.upgradeSubscription(
        user?.uid || user?.id,
        paymentResult.plan
      );

      // Refresh user data to get updated subscription
      await refreshUserData();

      setCurrentView("receipt");
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const handlePaymentCancel = () => {
    setSelectedPlan(null);
    setCurrentView("pricing");
  };

  const handleReceiptContinue = () => {
    setPaymentData(null);
    setSelectedPlan(null);
    setCurrentView("dashboard");
  };

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show login page if no user
  if (!user && currentView === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Combine user auth data with profile data for components
  const combinedUserData = {
    ...user,
    ...userProfile,
    // Ensure we have the essential properties
    uid: user?.uid || user?.id,
    email: user?.email || userProfile?.email,
    name: user?.name || user?.displayName || userProfile?.name,
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation
        user={combinedUserData}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onLogout={handleLogout}
      />

      <main className="transition-all duration-300">
        {currentView === "onboarding" && !hasCompletedOnboarding && (
          <OnboardingFlow
            onComplete={handleOnboardingComplete}
            userId={user?.uid || user?.id}
            user={combinedUserData}
          />
        )}
        {currentView === "pricing" && (
          <PricingPage
            user={combinedUserData}
            onUpgrade={handlePlanUpgrade}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === "payment" && selectedPlan && (
          <StripePayment
            selectedPlan={selectedPlan}
            user={combinedUserData}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        )}
        {currentView === "receipt" && paymentData && (
          <PaymentReceipt
            paymentData={paymentData}
            user={combinedUserData}
            onContinue={handleReceiptContinue}
          />
        )}
        {currentView === "dashboard" && (
          <Dashboard
            user={combinedUserData}
            posts={posts}
            onRefresh={refreshUserData}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === "admin" && user?.isAdmin && (
          <AdminPanel posts={posts} />
        )}
      </main>
    </div>
  );
};

export default App;
