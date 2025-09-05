import { ExternalLink, Linkedin } from "lucide-react";
import React from "react";

const LinkedInStep = ({ data, setData }) => {
  const handleUrlChange = (e) => {
    setData({ ...data, linkedinUrl: e.target.value });
  };

  const isValidLinkedInUrl = (url) => {
    const linkedinPattern =
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedinPattern.test(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Linkedin className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">
          What's your LinkedIn profile URL?
        </h3>
        <p className="text-zinc-600 font-medium">
          We'll analyze your current presence to create content that matches
          your brand.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            value={data.linkedinUrl || ""}
            onChange={handleUrlChange}
            className="w-full px-4 py-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200 bg-white font-medium text-zinc-900 placeholder-zinc-400"
          />
          {data.linkedinUrl && isValidLinkedInUrl(data.linkedinUrl) && (
            <div className="flex items-center space-x-2 mt-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium">Valid LinkedIn URL</span>
            </div>
          )}
          {data.linkedinUrl &&
            !isValidLinkedInUrl(data.linkedinUrl) &&
            data.linkedinUrl.length > 10 && (
              <div className="flex items-center space-x-2 mt-2 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Please enter a valid LinkedIn profile URL
                </span>
              </div>
            )}
        </div>

        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
          <h4 className="text-sm font-semibold text-zinc-900 mb-2">
            How to find your LinkedIn URL:
          </h4>
          <ol className="text-sm text-zinc-600 space-y-1 font-medium">
            <li>1. Go to your LinkedIn profile</li>
            <li>2. Click "Edit public profile & URL" on the right</li>
            <li>3. Copy the URL from the "Your public profile URL" section</li>
          </ol>
        </div>

        {data.linkedinUrl && isValidLinkedInUrl(data.linkedinUrl) && (
          <a
            href={data.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Your LinkedIn Profile</span>
          </a>
        )}
      </div>

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-700 font-medium">
          <strong>Privacy note:</strong> We only analyze publicly available
          information from your LinkedIn profile to better understand your
          professional brand and expertise.
        </p>
      </div>
    </div>
  );
};

export default LinkedInStep;
