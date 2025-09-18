import { Bot, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { profileService } from "../services/profileService";
import ComplianceStep from "./OnboardingSteps/ComplianceStep";
import DocumentsStep from "./OnboardingSteps/DocumentsStep";
import FrequencyStep from "./OnboardingSteps/FrequencyStep";
import GoalsStep from "./OnboardingSteps/GoalsStep";
import LinkedInStep from "./OnboardingSteps/LinkedInStep";
import TopicsStep from "./OnboardingSteps/TopicsStep";
import VoiceStep from "./OnboardingSteps/VoiceStep";

const OnboardingFlow = ({ onComplete, userId }) => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    topics: [],
    documents: [],
    linkedinUrl: "",
    goals: "",
    voiceStyle: "",
    postFrequency: "",
    complianceOptIn: false,
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

  const validateStep = (currentStep) => {
    setError(null);

    switch (currentStep) {
      case 0: // LinkedIn step
        if (!data.linkedinUrl) {
          setError("Please enter your LinkedIn URL");
          return false;
        }
        const linkedinPattern =
          /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
        if (!linkedinPattern.test(data.linkedinUrl)) {
          setError("Please enter a valid LinkedIn URL");
          return false;
        }
        break;
      case 2: // Goals step
        if (!data.goals || data.goals.trim().length < 10) {
          setError(
            "Please describe your content goals (at least 10 characters)"
          );
          return false;
        }
        break;
      case 3: // Voice step
        if (!data.voiceStyle) {
          setError("Please select a voice style");
          return false;
        }
        break;
      case 4: // Topics step
        if (!data.topics || data.topics.length === 0) {
          setError("Please select at least one topic");
          return false;
        }
        break;
      case 5: // Frequency step
        if (!data.postFrequency) {
          setError("Please select a posting frequency");
          return false;
        }
        break;
      case 6: // Compliance step
        if (!data.complianceOptIn) {
          setError("Please accept the terms and privacy policy to continue");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep(step)) {
      return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Final step - save profile
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if userId is available
      if (!userId) {
        throw new Error("User ID is required");
      }

      console.log("Saving profile for userId:", userId); // Debug log

      const profileData = {
        userId,
        linkedinUrl: data.linkedinUrl,
        goals: data.goals,
        voiceStyle: data.voiceStyle,
        topics: data.topics,
        postFrequency: data.postFrequency,
        complianceOptIn: data.complianceOptIn,
      };

      console.log("Profile data to save:", profileData); // Debug log

      await profileService.saveProfile(profileData, data.documents);

      // Call the onComplete callback to redirect to dashboard
      onComplete();
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(error.message || "Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setError(null);
    }
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

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

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
              disabled={step === 0 || isLoading}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center space-x-2 px-8 py-3 cursor-pointer bg-gradient-to-r from-zinc-700 to-zinc-900 hover:from-zinc-800 hover:to-black text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>
                {isLoading
                  ? "Saving..."
                  : step === steps.length - 1
                  ? "Complete Setup"
                  : "Continue"}
              </span>
              {!isLoading && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
