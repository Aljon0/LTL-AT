import { BookOpen, Lightbulb, MessageCircle, Users } from "lucide-react";
import React from "react";

const VoiceStep = ({ data, setData }) => {
  const voices = [
    {
      id: "professional",
      label: "Professional & Authoritative",
      desc: "Confident, expert tone",
      icon: Users,
      example: "Leveraging data-driven insights to optimize performance...",
    },
    {
      id: "conversational",
      label: "Conversational & Approachable",
      desc: "Friendly, relatable style",
      icon: MessageCircle,
      example: "Here's what I learned from my latest project...",
    },
    {
      id: "thought-provoking",
      label: "Thought-Provoking",
      desc: "Challenging, insightful perspective",
      icon: Lightbulb,
      example: "What if we've been thinking about this problem all wrong?",
    },
    {
      id: "storytelling",
      label: "Storytelling",
      desc: "Narrative-driven, engaging",
      icon: BookOpen,
      example: "Three years ago, I made a mistake that changed everything...",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">
          What's your preferred voice and style?
        </h3>
        <p className="text-zinc-600 font-medium">
          Choose the tone that best represents how you want to communicate.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {voices.map((voice) => (
          <button
            key={voice.id}
            onClick={() => setData({ ...data, voiceStyle: voice.id })}
            className={`p-5 rounded-xl border-2 transition-all duration-200 text-left ${
              data.voiceStyle === voice.id
                ? "border-zinc-600 bg-zinc-50 shadow-md"
                : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
            }`}
          >
            <div className="flex items-start space-x-3 mb-3">
              <div
                className={`p-2 rounded-xl ${
                  data.voiceStyle === voice.id ? "bg-zinc-200" : "bg-zinc-100"
                }`}
              >
                <voice.icon className="w-5 h-5 text-zinc-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-zinc-900 mb-1">
                  {voice.label}
                </p>
                <p className="text-sm text-zinc-600 font-medium">
                  {voice.desc}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-zinc-200">
              <p className="text-xs text-zinc-500 font-medium italic">
                "{voice.example}"
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
        <h4 className="text-sm font-semibold text-zinc-900 mb-2">
          Voice & Style Tips:
        </h4>
        <ul className="text-sm text-zinc-600 space-y-1 font-medium">
          <li>• Your voice should feel authentic to your personality</li>
          <li>• Consider your audience and industry expectations</li>
          <li>• Consistency helps build a recognizable personal brand</li>
          <li>• You can always adjust this later in settings</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceStep;
