import {
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  FileText,
  Loader2,
  Send,
} from "lucide-react";
import React, { useState } from "react";

const EnhancedPostGenerator = ({ user, includeTrends, onPostGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [error, setError] = useState(null);
  const [generationStep, setGenerationStep] = useState("");
  const [selectedPost, setSelectedPost] = useState("short"); // Toggle between short and long

  const generateTestPost = async () => {
    setIsLoading(true);
    setError(null);
    setEmailStatus(null);
    setGeneratedContent(null);
    setGenerationStep("Preparing request...");

    try {
      const testPrompt =
        "Create LinkedIn posts based on my profile and current industry trends";

      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
      }, 90000);

      setGenerationStep(
        includeTrends
          ? "Generating short and long posts with current trends..."
          : "Generating short and long test posts..."
      );

      const response = await fetch(
        "http://localhost:3001/api/generate-post-with-trends",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          signal: controller.signal,
          body: JSON.stringify({
            userId: user?.uid || user?.id,
            prompt: testPrompt,
            context: "Generate both short and long format posts for LinkedIn",
            profileData: {
              goals: user?.goals || "professional growth",
              voiceStyle: user?.voiceStyle || "professional",
              topics: user?.topics || ["business", "technology"],
              linkedinUrl: user?.linkedinUrl || "",
            },
            documentContext: user?.documentContext || "",
            includeTrends: includeTrends,
          }),
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Dual posts generated successfully");

      setGenerationStep("Sending both posts via email...");

      // Send the email with both posts
      try {
        const emailResponse = await fetch(
          "http://localhost:3001/api/send-test-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              userId: user?.uid || user?.id,
              shortPost: result.shortPost,
              longPost: result.longPost,
              userEmail: user?.email,
            }),
          }
        );

        if (emailResponse.ok) {
          console.log("Email sent successfully!");
          setEmailStatus("success");
        } else {
          console.warn("Email sending failed, but posts were generated");
          setEmailStatus("email-failed");
        }
      } catch (emailError) {
        console.warn("Email sending failed:", emailError);
        setEmailStatus("email-failed");
      }

      setGeneratedContent({
        shortPost: result.shortPost,
        longPost: result.longPost,
        trendsUsed: result.trendsUsed || [],
        metadata: result.metadata,
      });

      if (onPostGenerated) {
        onPostGenerated(result);
      }

      setGenerationStep("");
    } catch (error) {
      console.error("Error in generateTestPost:", error);

      if (error.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else if (error.message.includes("Failed to fetch")) {
        setError("Connection error. Please check if the server is running.");
      } else {
        setError(
          error.message || "Failed to generate posts. Please try again."
        );
      }

      setEmailStatus(null);
      setGenerationStep("");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      const prevStatus = emailStatus;
      setEmailStatus("copied");
      setTimeout(() => setEmailStatus(prevStatus), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getCurrentPost = () => {
    if (!generatedContent) return null;
    return selectedPost === "short"
      ? generatedContent.shortPost
      : generatedContent.longPost;
  };

  const getCharacterCount = (text) => {
    return text ? text.length : 0;
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {(emailStatus === "success" || emailStatus === "email-failed") && (
        <div
          className={`${
            emailStatus === "success"
              ? "bg-emerald-50 border-emerald-200"
              : "bg-amber-50 border-amber-200"
          } border rounded-xl p-4`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle
              className={`w-5 h-5 ${
                emailStatus === "success"
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  emailStatus === "success"
                    ? "text-emerald-700"
                    : "text-amber-700"
                }`}
              >
                {emailStatus === "success"
                  ? "Both short and long posts generated and sent to your email!"
                  : "Posts generated successfully! (Email notification failed)"}
              </p>
              <p
                className={`text-xs mt-1 ${
                  emailStatus === "success"
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              >
                ✓ 1 Short Post (
                {generatedContent?.shortPost
                  ? `${getCharacterCount(generatedContent.shortPost)} chars`
                  : ""}
                ){" • "}✓ 1 Long Post (
                {generatedContent?.longPost
                  ? `${getCharacterCount(generatedContent.longPost)} chars`
                  : ""}
                )
              </p>
            </div>
          </div>
          {generatedContent?.trendsUsed &&
            generatedContent.trendsUsed.length > 0 && (
              <div
                className={`mt-2 text-xs ${
                  emailStatus === "success"
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              >
                Incorporated {generatedContent.trendsUsed.length} trending
                topics
              </div>
            )}
        </div>
      )}

      {/* Copied Message */}
      {emailStatus === "copied" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-700 font-medium">
              Post copied to clipboard!
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
        <h3 className="text-xl font-semibold text-zinc-900 mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={generateTestPost}
            disabled={isLoading || !user?.email}
            className="flex items-center space-x-3 p-5 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:from-zinc-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>
              {isLoading
                ? generationStep || "Generating..."
                : "Generate Short + Long Posts"}
            </span>
          </button>
        </div>

        {!user?.email && (
          <div className="mt-4 text-sm text-red-500 font-medium">
            User email is required for post generation
          </div>
        )}

        <div className="mt-4 text-sm text-zinc-500 font-medium">
          {includeTrends
            ? "Posts will include current industry trends and news insights"
            : "Enable trend integration above to include current topics"}
        </div>

        <div className="mt-2 p-3 bg-violet-50 rounded-lg">
          <p className="text-xs text-violet-700 font-medium">
            📝 Each generation creates 2 posts: 1 short (600-900 chars) + 1 long
            (1200-2000 chars)
          </p>
        </div>
      </div>

      {/* Generated Content Preview */}
      {generatedContent && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl shadow-zinc-200/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-zinc-900">
              Generated Posts Preview
            </h3>

            {/* Post Type Toggle */}
            <div className="flex space-x-2 bg-zinc-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedPost("short")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedPost === "short"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1" />
                Short Post
              </button>
              <button
                onClick={() => setSelectedPost("long")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedPost === "long"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1" />
                Long Post
              </button>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 mb-4">
            <pre className="whitespace-pre-wrap text-sm text-zinc-800 font-medium leading-relaxed">
              {getCurrentPost()}
            </pre>
          </div>

          {generatedContent.trendsUsed &&
            generatedContent.trendsUsed.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-zinc-900 mb-2">
                  Trends Referenced:
                </h4>
                <div className="space-y-2">
                  {generatedContent.trendsUsed.map((trend, index) => (
                    <div
                      key={index}
                      className="text-xs text-zinc-600 bg-violet-50 p-2 rounded-lg"
                    >
                      <span className="font-medium">
                        {trend.title || "Untitled trend"}
                      </span>
                      {trend.source && (
                        <span className="text-violet-600 ml-2">
                          • {trend.source}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="flex space-x-3">
            <button
              onClick={() => copyToClipboard(getCurrentPost())}
              className="flex items-center space-x-2 px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium text-sm"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Current Post</span>
            </button>
            <a
              href="https://linkedin.com/feed"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Post to LinkedIn</span>
            </a>
          </div>

          {/* Info about both posts */}
          <div className="mt-4 p-3 bg-zinc-50 rounded-lg">
            <p className="text-xs text-zinc-600">
              <strong>💡 Tip:</strong> Both posts have been sent to your email.
              The short post (
              {generatedContent.shortPost
                ? getCharacterCount(generatedContent.shortPost)
                : 0}{" "}
              chars) is perfect for quick updates, while the long post (
              {generatedContent.longPost
                ? getCharacterCount(generatedContent.longPost)
                : 0}{" "}
              chars) works great for detailed insights.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPostGenerator;
