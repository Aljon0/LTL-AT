import { Loader2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { profileService } from "../services/profileService";
import ComplianceStep from "./OnboardingSteps/ComplianceStep";
import DocumentsStep from "./OnboardingSteps/DocumentsStep";
import FrequencyStep from "./OnboardingSteps/FrequencyStep";
import GoalsStep from "./OnboardingSteps/GoalsStep";
import LinkedInStep from "./OnboardingSteps/LinkedInStep";
import TopicsStep from "./OnboardingSteps/TopicsStep";
import VoiceStep from "./OnboardingSteps/VoiceStep";

const ProfileUpdateModal = ({ isOpen, onClose, userId, onUpdate }) => {
  const [activeSection, setActiveSection] = useState("linkedin");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  const sections = [
    { id: "linkedin", label: "LinkedIn Profile" },
    { id: "documents", label: "Documents" },
    { id: "goals", label: "Goals" },
    { id: "voice", label: "Voice & Style" },
    { id: "topics", label: "Topics" },
    { id: "frequency", label: "Post Frequency" },
    { id: "compliance", label: "Privacy Settings" },
  ];

  // Load existing profile data when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      loadProfile();
    }
  }, [isOpen, userId]);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await profileService.getProfile(userId);
      if (response.profile) {
        setData({
          topics: response.profile.topics || [],
          documents: response.profile.documents || [],
          linkedinUrl: response.profile.linkedin_url || "",
          goals: response.profile.goals || "",
          voiceStyle: response.profile.voice_style || "",
          postFrequency: response.profile.post_frequency || "",
          complianceOptIn: response.profile.compliance_opt_in || false,
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const profileData = {
        userId,
        linkedinUrl: data.linkedinUrl,
        goals: data.goals,
        voiceStyle: data.voiceStyle,
        topics: data.topics,
        postFrequency: data.postFrequency,
        complianceOptIn: data.complianceOptIn,
      };

      await profileService.saveProfile(profileData, data.documents);
      onUpdate && onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900">
              Update Profile
            </h2>
            <p className="text-sm text-zinc-600 mt-1">
              Modify your LinkedIn content preferences
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-zinc-50 border-r border-zinc-200 p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    activeSection === section.id
                      ? "bg-zinc-800 text-white shadow-lg"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                  <span className="ml-3 text-zinc-600">
                    Loading profile data...
                  </span>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-700 font-medium">
                        {error}
                      </p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {activeSection === "linkedin" && (
                      <LinkedInStep data={data} setData={setData} />
                    )}
                    {activeSection === "documents" && (
                      <DocumentsStep data={data} setData={setData} />
                    )}
                    {activeSection === "goals" && (
                      <GoalsStep data={data} setData={setData} />
                    )}
                    {activeSection === "voice" && (
                      <VoiceStep data={data} setData={setData} />
                    )}
                    {activeSection === "topics" && (
                      <TopicsStep data={data} setData={setData} />
                    )}
                    {activeSection === "frequency" && (
                      <FrequencyStep data={data} setData={setData} />
                    )}
                    {activeSection === "compliance" && (
                      <ComplianceStep data={data} setData={setData} />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-zinc-200 bg-zinc-50">
          <button
            onClick={onClose}
            className="px-6 py-3 text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-zinc-700 to-zinc-900 hover:from-zinc-800 hover:to-black text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;
