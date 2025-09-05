import { Calendar, Clock } from "lucide-react";
import React from "react";

const FrequencyStep = ({ data, setData }) => {
  const frequencies = [
    {
      id: "daily",
      label: "Daily",
      desc: "High-frequency posting",
      posts: "7 posts per week",
    },
    {
      id: "weekly",
      label: "2-3 times per week",
      desc: "Regular presence",
      posts: "~12 posts per month",
    },
    {
      id: "biweekly",
      label: "Weekly",
      desc: "Consistent updates",
      posts: "4 posts per month",
    },
    {
      id: "monthly",
      label: "Bi-weekly",
      desc: "Quality over quantity",
      posts: "2 posts per month",
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
          We'll generate and schedule content based on your preferred frequency.
        </p>
      </div>

      <div className="space-y-3">
        {frequencies.map((freq) => (
          <button
            key={freq.id}
            onClick={() => setData({ ...data, postFrequency: freq.id })}
            className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left ${
              data.postFrequency === freq.id
                ? "border-zinc-600 bg-zinc-50 shadow-md"
                : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <p className="font-semibold text-zinc-900">{freq.label}</p>
                  <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full font-medium">
                    {freq.posts}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 font-medium">{freq.desc}</p>
              </div>
              <div
                className={`p-2 rounded-xl ${
                  data.postFrequency === freq.id ? "bg-zinc-200" : "bg-zinc-100"
                }`}
              >
                <Clock className="w-5 h-5 text-zinc-600" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
        <p className="text-sm text-zinc-600 font-medium">
          💡 <strong>Tip:</strong> Consistent posting is more effective than
          sporadic high-frequency bursts. Choose a frequency you can maintain
          long-term.
        </p>
      </div>
    </div>
  );
};

export default FrequencyStep;
