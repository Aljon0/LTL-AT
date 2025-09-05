import { Check, Clock, Shield, Star } from "lucide-react";
import React from "react";

const PricingPage = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 posts per month",
        "Basic templates",
        "LinkedIn integration",
        "Email support",
      ],
      posts: 5,
      popular: false,
    },
    {
      name: "Standard",
      price: "$29",
      period: "per month",
      description: "For regular content creators",
      features: [
        "25 posts per month",
        "Advanced AI writing",
        "Content calendar",
        "Analytics dashboard",
        "Priority support",
      ],
      posts: 25,
      popular: true,
    },
    {
      name: "Pro",
      price: "$79",
      period: "per month",
      description: "For thought leaders",
      features: [
        "Unlimited posts",
        "Custom voice training",
        "Team collaboration",
        "White-label options",
        "Dedicated support",
      ],
      posts: "Unlimited",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto font-medium">
            Scale your LinkedIn presence with AI-powered content that resonates
            with your audience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 ${
                plan.popular
                  ? "border-zinc-700 ring-2 ring-zinc-700/20 shadow-zinc-300/30"
                  : "border-zinc-200/60 shadow-zinc-200/50"
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
                  <p className="text-zinc-600 font-medium">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="p-1 bg-emerald-50 rounded-lg">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-zinc-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                    plan.popular
                      ? "bg-gradient-to-r from-zinc-700 to-zinc-900 hover:from-zinc-800 hover:to-black text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  Select {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-zinc-600 mb-6 font-medium text-lg">
            All plans include a 14-day free trial
          </p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
