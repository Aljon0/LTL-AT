import { Lightbulb, Target } from "lucide-react";
import React from "react";

const GoalsStep = ({ data, setData }) => {
  const handleGoalsChange = (e) => {
    setData({ ...data, goals: e.target.value });
  };

  const exampleGoals = [
    "Build thought leadership in AI/ML",
    "Generate leads for consulting services",
    "Establish expertise in fintech",
    "Share startup journey insights",
    "Build network in tech industry",
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">
          What are your content goals?
        </h3>
        <p className="text-zinc-600 font-medium">
          Help us understand what you want to achieve with your LinkedIn
          presence.
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          placeholder="Describe your content objectives and what you want to achieve..."
          value={data.goals || ""}
          onChange={handleGoalsChange}
          rows={5}
          className="w-full px-4 py-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200 resize-none bg-white font-medium text-zinc-900 placeholder-zinc-400"
        />

        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-4 h-4 text-zinc-600" />
            <span className="text-sm font-semibold text-zinc-900">
              Example Goals
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {exampleGoals.map((goal, index) => (
              <button
                key={index}
                onClick={() => {
                  const currentGoals = data.goals || "";
                  const newGoals = currentGoals
                    ? `${currentGoals}, ${goal}`
                    : goal;
                  setData({ ...data, goals: newGoals });
                }}
                className="text-xs bg-white text-zinc-600 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-colors font-medium"
              >
                + {goal}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-700 font-medium">
          <strong>Pro tip:</strong> The more specific your goals, the better we
          can tailor your content strategy. Think about your target audience and
          desired outcomes.
        </p>
      </div>
    </div>
  );
};

export default GoalsStep;
