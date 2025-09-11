import { Calendar, Clock } from "lucide-react";
import React from "react";

const FrequencyStep = ({ data, setData }) => {
  const frequencies = [
    {
      id: "daily",
      label: "Daily",
      desc: "1 post per day",
      icon: Calendar,
      recommendation: "Best for building strong engagement",
    },
    {
      id: "3-times-week",
      label: "3x per week",
      desc: "3 posts per week",
      icon: Calendar,
      recommendation: "Balanced approach for professionals",
    },
    {
      id: "weekly",
      label: "Weekly",
      desc: "1 post per week",
      icon: Calendar,
      recommendation: "Sustainable for busy schedules",
    },
    {
      id: "bi-weekly",
      label: "Bi-weekly",
      desc: "Every 2 weeks",
      icon: Clock,
      recommendation: "Good for thought leadership",
    },
  ];

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
          Choose a posting frequency that you can maintain consistently.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {frequencies.map((frequency) => (
          <button
            key={frequency.id}
            onClick={() => setData({ ...data, postFrequency: frequency.id })}
            className={`p-5 rounded-xl border-2 transition-all duration-200 text-left ${
              data.postFrequency === frequency.id
                ? "border-zinc-600 bg-zinc-50 shadow-md"
                : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
            }`}
          >
            <div className="flex items-start space-x-3 mb-3">
              <div
                className={`p-2 rounded-xl ${
                  data.postFrequency === frequency.id
                    ? "bg-zinc-200"
                    : "bg-zinc-100"
                }`}
              >
                <frequency.icon className="w-5 h-5 text-zinc-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-zinc-900 mb-1">
                  {frequency.label}
                </p>
                <p className="text-sm text-zinc-600 font-medium mb-2">
                  {frequency.desc}
                </p>
                <p className="text-xs text-zinc-500 font-medium">
                  {frequency.recommendation}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
        <h4 className="text-sm font-semibold text-zinc-900 mb-2">
          Posting Frequency Tips:
        </h4>
        <ul className="text-sm text-zinc-600 space-y-1 font-medium">
          <li>• Consistency is more important than frequency</li>
          <li>• Start with a manageable schedule you can maintain</li>
          <li>• You can always adjust your frequency later</li>
          <li>• Quality content matters more than quantity</li>
        </ul>
      </div>
    </div>
  );
};

export default FrequencyStep;
