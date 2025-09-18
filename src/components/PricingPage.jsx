import {
  ArrowLeft,
  Check,
  Clock,
  Loader2,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

const PricingPage = ({ user, onUpgrade, setCurrentView }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "per month",
      description: "Good for casual users testing the service",
      frequency: "1 delivery per month",
      posts: "1 short + 1 long post",
      monthlyPosts: 2,
      features: [
        "1 delivery per month",
        "1 short + 1 long LinkedIn post",
        "Basic AI content generation",
        "Email delivery",
        "Standard templates",
        "Community support",
      ],
      popular: false,
      automationFeatures: [
        "Monthly email delivery",
        "Basic content personalization",
        "Document upload (up to 5MB)",
      ],
    },
    {
      id: "standard",
      name: "Standard",
      price: "$9",
      period: "per month",
      description:
        "Encourages consistent weekly posting (LinkedIn suggests weekly posts double engagement)",
      frequency: "1 delivery per week",
      posts: "1 short + 1 long post",
      monthlyPosts: 8,
      features: [
        "1 delivery per week",
        "1 short + 1 long LinkedIn post per delivery",
        "Advanced AI content generation",
        "Custom scheduling",
        "Enhanced personalization",
        "Priority email support",
        "Content calendar integration",
      ],
      popular: true,
      automationFeatures: [
        "Weekly email delivery",
        "Advanced voice training",
        "Document upload (up to 50MB)",
        "Industry-specific templates",
        "Engagement optimization",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "per month",
      description:
        "Supports users aiming for daily posting. Emphasize quality over quantity and vary content types",
      frequency: "1 delivery per day",
      posts: "1 short + 1 long post",
      monthlyPosts: 60,
      features: [
        "1 delivery per day",
        "1 short + 1 long LinkedIn post per delivery",
        "Premium AI content generation",
        "Advanced analytics",
        "Multiple content themes",
        "Dedicated support manager",
        "API access",
        "Content performance insights",
      ],
      popular: false,
      automationFeatures: [
        "Daily email delivery",
        "Custom AI model training",
        "Unlimited document upload",
        "White-label email templates",
        "Content variety optimization",
        "Peak engagement timing",
      ],
    },
  ];

  const handlePlanSelect = async (plan) => {
    if (plan.id === "free") {
      // Free plan doesn't require payment
      return;
    }

    setIsLoading(true);
    setSelectedPlan(plan.id);

    try {
      // For paid plans, trigger the payment flow
      if (onUpgrade) {
        await onUpgrade(plan.id);
      }
    } catch (error) {
      console.error("Error upgrading plan:", error);
      setError("Failed to process upgrade. Please try again.");
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const currentPlan = user?.subscription || "free";

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Dashboard Button */}
        {user && setCurrentView && (
          <div className="mb-8">
            <button
              onClick={() => setCurrentView("dashboard")}
              className="flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        )}

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">
            Choose Your Content Automation Plan
          </h1>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto font-medium">
            Automate your LinkedIn presence with AI-powered content delivered
            directly to your email. Each delivery includes both short and
            long-form posts to maximize your professional impact.
          </p>
          {user?.subscription && (
            <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-medium">
                Currently on{" "}
                {user.subscription.charAt(0).toUpperCase() +
                  user.subscription.slice(1)}{" "}
                plan
              </span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700 font-medium text-center">
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 ${
                plan.popular
                  ? "border-zinc-700 ring-2 ring-zinc-700/20 shadow-zinc-300/30 scale-105"
                  : "border-zinc-200/60 shadow-zinc-200/50"
              } ${
                currentPlan === plan.id
                  ? "ring-2 ring-emerald-500 border-emerald-500"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-zinc-700 to-zinc-900 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </span>
                </div>
              )}

              {currentPlan === plan.id && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-zinc-900">
                      {plan.price}
                    </span>
                    <span className="text-zinc-600 ml-2 font-medium">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="text-zinc-600 font-medium text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Delivery Frequency Highlight */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">
                      Automated Delivery
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-blue-700 font-medium">
                      {plan.frequency}
                    </p>
                    <p className="text-xs text-blue-600">
                      {plan.posts} per delivery
                    </p>
                    <p className="text-xs text-blue-600">
                      ~{plan.monthlyPosts} posts per month
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <h4 className="text-sm font-semibold text-zinc-900 mb-3">
                    Core Features:
                  </h4>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start space-x-3">
                      <div className="p-1 bg-emerald-50 rounded-lg flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-zinc-700 font-medium leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}

                  <h4 className="text-sm font-semibold text-zinc-900 mb-3 mt-6">
                    Automation Features:
                  </h4>
                  {plan.automationFeatures.map((feature) => (
                    <div key={feature} className="flex items-start space-x-3">
                      <div className="p-1 bg-blue-50 rounded-lg flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-zinc-700 font-medium leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isLoading || currentPlan === plan.id}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 ${
                    currentPlan === plan.id
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default"
                      : plan.popular
                      ? "bg-gradient-to-r from-zinc-700 to-zinc-900 hover:from-zinc-800 hover:to-black text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 hover:border-zinc-300 disabled:opacity-50"
                  }`}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : currentPlan === plan.id ? (
                    <span>Current Plan</span>
                  ) : plan.id === "free" ? (
                    <span>Get Started Free</span>
                  ) : (
                    <span>Upgrade to {plan.name}</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Details Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 text-center mb-12">
            What's Included in Each Delivery
          </h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-zinc-200/60 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    Short-Form Post
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-zinc-700">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>150-300 words perfect for quick engagement</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Industry insights and professional tips</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Optimized hashtags and call-to-actions</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-violet-50 rounded-lg">
                    <Zap className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    Long-Form Post
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-zinc-700">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>500-800 words for thought leadership</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Deep-dive industry analysis and trends</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Personal stories and professional insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 text-center mb-12">
            How Automated Content Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-zinc-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Complete Your Profile
              </h3>
              <p className="text-zinc-600">
                Set your goals, voice, topics, and upload reference documents
                once
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-zinc-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                AI Creates Content
              </h3>
              <p className="text-zinc-600">
                Our AI generates both short and long-form posts automatically
                based on your profile
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-zinc-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Delivered to Your Inbox
              </h3>
              <p className="text-zinc-600">
                Receive professionally crafted posts via email on your chosen
                schedule
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="flex justify-center space-x-12 text-sm text-zinc-500">
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-zinc-100 rounded-lg">
                <Shield className="w-4 h-4 text-zinc-600" />
              </div>
              <span className="font-medium">Secure payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-zinc-100 rounded-lg">
                <Clock className="w-4 h-4 text-zinc-600" />
              </div>
              <span className="font-medium">Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-zinc-100 rounded-lg">
                <Check className="w-4 h-4 text-zinc-600" />
              </div>
              <span className="font-medium">No setup fees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
