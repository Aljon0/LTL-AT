import { Calendar, Clock, Crown, Lock } from "lucide-react";
import React from "react";

const FrequencyStep = ({ data, setData, userSubscription = "free" }) => {
  const frequencies = [
    {
      id: "daily",
      label: "Daily",
      desc: "1 delivery per day",
      icon: Calendar,
      recommendation: "Best for building strong engagement",
      requiredPlan: "pro",
      planLabel: "Pro Plan",
    },
    {
      id: "weekly",
      label: "Weekly",
      desc: "1 delivery per week",
      icon: Calendar,
      recommendation: "LinkedIn suggests weekly posts double engagement",
      requiredPlan: "standard",
      planLabel: "Standard Plan",
    },
    {
      id: "monthly",
      label: "Monthly",
      desc: "1 delivery per month",
      icon: Clock,
      recommendation: "Good for testing the service",
      requiredPlan: "free",
      planLabel: "Free Plan",
    },
  ];

  // Check if user can access a frequency based on their subscription
  const canAccessFrequency = (requiredPlan) => {
    const planHierarchy = { free: 0, standard: 1, pro: 2 };
    return planHierarchy[userSubscription] >= planHierarchy[requiredPlan];
  };

  // If user is on free plan and hasn't selected anything, default to monthly
  React.useEffect(() => {
    if (userSubscription === "free" && !data.postFrequency) {
      setData({ ...data, postFrequency: "monthly" });
    }
  }, [userSubscription, data, setData]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">
          How often do you want to post?
        </h3>
        <p className="text-zinc-600 font-medium">
          Choose a posting frequency based on your plan. Each delivery includes
          both short and long-form posts.
        </p>
      </div>

      {/* Plan Info for Free Users */}
      {userSubscription === "free" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">
              Free Plan
            </span>
          </div>
          <p className="text-sm text-blue-700">
            You're currently on the free plan with 1 monthly delivery. Upgrade
            to access weekly or daily posting frequencies.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {frequencies.map((frequency) => {
          const isAccessible = canAccessFrequency(frequency.requiredPlan);
          const isSelected = data.postFrequency === frequency.id;

          return (
            <div
              key={frequency.id}
              className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-zinc-600 bg-zinc-50 shadow-md"
                  : isAccessible
                  ? "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
                  : "border-zinc-200 bg-zinc-50/30"
              } ${!isAccessible ? "opacity-60" : ""}`}
            >
              {/* Lock overlay for inaccessible plans */}
              {!isAccessible && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-4 h-4 text-zinc-400" />
                </div>
              )}

              <button
                onClick={() => {
                  if (isAccessible) {
                    setData({ ...data, postFrequency: frequency.id });
                  }
                }}
                disabled={!isAccessible}
                className={`w-full text-left ${
                  isAccessible ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected ? "bg-zinc-200" : "bg-zinc-100"
                    }`}
                  >
                    <frequency.icon className="w-5 h-5 text-zinc-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p
                        className={`font-semibold ${
                          isAccessible ? "text-zinc-900" : "text-zinc-500"
                        }`}
                      >
                        {frequency.label}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          frequency.requiredPlan === "free"
                            ? "bg-zinc-100 text-zinc-600"
                            : frequency.requiredPlan === "standard"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {frequency.planLabel}
                      </span>
                    </div>
                    <p
                      className={`text-sm font-medium mb-2 ${
                        isAccessible ? "text-zinc-600" : "text-zinc-400"
                      }`}
                    >
                      {frequency.desc}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        isAccessible ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      {frequency.recommendation}
                    </p>

                    {!isAccessible && (
                      <div className="mt-2">
                        <p className="text-xs text-zinc-500 font-medium">
                          Upgrade to {frequency.planLabel} to unlock this
                          frequency
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
        <h4 className="text-sm font-semibold text-zinc-900 mb-2">
          Delivery Details:
        </h4>
        <ul className="text-sm text-zinc-600 space-y-1 font-medium">
          <li>• Each delivery includes 1 short post + 1 long-form post</li>
          <li>
            • Posts are delivered via email with LinkedIn-ready formatting
          </li>
          <li>• Consistency is more important than frequency</li>
          <li>• You can upgrade your plan anytime to increase frequency</li>
        </ul>
      </div>

      {/* Upgrade CTA for free users */}
      {userSubscription === "free" && (
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-xl p-6 text-center">
          <h4 className="text-white font-semibold mb-2">
            Want to post more frequently?
          </h4>
          <p className="text-zinc-300 text-sm mb-4 font-medium">
            Upgrade to Standard for weekly posts or Pro for daily content
            delivery
          </p>
          <div className="flex justify-center space-x-3">
            <div className="text-xs text-zinc-400">
              <span className="font-medium">Standard:</span> $9/month • Weekly
              delivery
            </div>
            <span className="text-zinc-500">|</span>
            <div className="text-xs text-zinc-400">
              <span className="font-medium">Pro:</span> $29/month • Daily
              delivery
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequencyStep;
