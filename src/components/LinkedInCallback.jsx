import React, { useEffect, useState } from "react";
import { handleLinkedInCallback } from "../lib/firebase";

const LinkedInCallback = () => {
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const error = urlParams.get("error");

      if (error) {
        setStatus("Authentication cancelled");
        if (window.opener) {
          window.opener.postMessage(
            { type: "LINKEDIN_AUTH_ERROR", error: "Login cancelled by user" },
            window.location.origin
          );
          setTimeout(() => window.close(), 1500);
        }
        return;
      }

      if (!code || !state) {
        setStatus("Invalid authentication response");
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "LINKEDIN_AUTH_ERROR",
              error: "Invalid response from LinkedIn",
            },
            window.location.origin
          );
          setTimeout(() => window.close(), 1500);
        }
        return;
      }

      try {
        setStatus("Authenticating with LinkedIn...");
        const result = await handleLinkedInCallback(code, state);

        setStatus("Success! Redirecting...");

        // Send success message to parent window
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: "LINKEDIN_AUTH_SUCCESS", user: result.user },
            window.location.origin
          );
          setTimeout(() => window.close(), 1000);
        } else {
          // If no opener or opener is closed, store the auth data and redirect
          sessionStorage.setItem(
            "linkedin_auth_result",
            JSON.stringify(result.user)
          );
          window.location.href = "/";
        }
      } catch (error) {
        console.error("LinkedIn callback error:", error);
        setStatus("Authentication failed");

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: "LINKEDIN_AUTH_ERROR", error: error.message },
            window.location.origin
          );
          setTimeout(() => window.close(), 2000);
        } else {
          // If no opener, redirect with error
          window.location.href =
            "/?linkedin_error=" + encodeURIComponent(error.message);
        }
      }
    };

    processCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-[#0077B5]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-zinc-800 mb-2">
          LinkedIn Authentication
        </h2>
        <p className="text-zinc-600">{status}</p>
        <div className="mt-6">
          <div className="w-8 h-8 border-3 border-[#0077B5] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInCallback;
