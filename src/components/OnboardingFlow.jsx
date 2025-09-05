import { Bot, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import ComplianceStep from "./OnboardingSteps/ComplianceStep";
import DocumentsStep from "./OnboardingSteps/DocumentsStep";
import FrequencyStep from "./OnboardingSteps/FrequencyStep";
import GoalsStep from "./OnboardingSteps/GoalsStep";
import LinkedInStep from "./OnboardingSteps/LinkedInStep";
import TopicsStep from "./OnboardingSteps/TopicsStep";
import VoiceStep from "./OnboardingSteps/VoiceStep";

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    topics: [],
    documents: [],
  });

  const steps = [
    { title: "LinkedIn Profile", key: "linkedin" },
    { title: "Upload Documents", key: "documents" },
    { title: "Define Goals", key: "goals" },
    { title: "Voice & Style", key: "voice" },
    { title: "Topics & Industries", key: "topics" },
    { title: "Post Frequency", key: "frequency" },
    { title: "Compliance", key: "compliance" },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-zinc-600 mb-3 font-medium">
            <span>
              Step {step + 1} of {steps.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-zinc-700 to-zinc-900 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Chat-style Onboarding */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-zinc-200/60 p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-zinc-900 text-lg">
                  AI Assistant
                </p>
                <p className="text-sm text-zinc-500 font-medium">
                  Let's set up your profile - {steps[step].title}
                </p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6 mb-8">
            {step === 0 && <LinkedInStep data={data} setData={setData} />}
            {step === 1 && <DocumentsStep data={data} setData={setData} />}
            {step === 2 && <GoalsStep data={data} setData={setData} />}
            {step === 3 && <VoiceStep data={data} setData={setData} />}
            {step === 4 && <TopicsStep data={data} setData={setData} />}
            {step === 5 && <FrequencyStep data={data} setData={setData} />}
            {step === 6 && <ComplianceStep data={data} setData={setData} />}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-zinc-200">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-8 py-3 cursor-pointer bg-gradient-to-r from-zinc-700 to-zinc-900 hover:from-zinc-800 hover:to-black text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <span>
                {step === steps.length - 1 ? "Complete Setup" : "Continue"}
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
