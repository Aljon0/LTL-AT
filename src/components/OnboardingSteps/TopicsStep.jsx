import { Brain, Hash } from "lucide-react";
import React from "react";

const TopicsStep = ({ data, setData }) => {
  const topicOptions = [
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "Product Management",
    "Leadership",
    "Entrepreneurship",
    "Startup Culture",
    "Digital Marketing",
    "Sales",
    "Finance",
    "Healthcare",
    "Education",
    "Sustainability",
    "Remote Work",
    "Innovation",
    "Technology Trends",
    "Career Development",
  ];

  const toggleTopic = (topic) => {
    const currentTopics = data.topics || [];
    const updated = currentTopics.includes(topic)
      ? currentTopics.filter((t) => t !== topic)
      : [...currentTopics, topic];
    setData({ ...data, topics: updated });
  };

  const selectedCount = (data.topics || []).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">
          What topics do you want to cover?
        </h3>
        <p className="text-zinc-600 font-medium">
          Select the industries and subjects you want to create content about.
        </p>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center justify-center space-x-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
          <Hash className="w-4 h-4 text-zinc-600" />
          <span className="text-sm font-semibold text-zinc-900">
            {selectedCount} topic{selectedCount !== 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {topicOptions.map((topic) => (
          <button
            key={topic}
            onClick={() => toggleTopic(topic)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
              data.topics?.includes(topic)
                ? "border-zinc-600 bg-zinc-50 text-zinc-900 shadow-md"
                : "border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:bg-zinc-50/50"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
          <p className="text-sm text-zinc-600 font-medium">
            <strong>Recommendation:</strong> Choose 3-5 topics you're most
            passionate about. This helps us create focused, authentic content
            that establishes your expertise.
          </p>
        </div>

        {selectedCount > 7 && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-amber-700 font-medium">
              <strong>Note:</strong> You've selected many topics. Consider
              focusing on fewer areas to build stronger thought leadership in
              specific domains.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsStep;
