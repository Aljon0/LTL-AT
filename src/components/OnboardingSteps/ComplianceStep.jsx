import { Check, Shield } from "lucide-react";
import React from "react";

const ComplianceStep = ({ data, setData }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Shield className="w-8 h-8 text-zinc-600" />
      </div>
      <h3 className="text-xl font-semibold text-zinc-900 mb-2">
        Privacy & Compliance
      </h3>
      <p className="text-zinc-600 font-medium">
        We take your data privacy seriously and comply with all relevant
        regulations.
      </p>
    </div>

    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <input
              type="checkbox"
              id="compliance"
              checked={data.complianceOptIn || false}
              onChange={(e) =>
                setData({ ...data, complianceOptIn: e.target.checked })
              }
              className="w-5 h-5 text-zinc-600 border-zinc-300 rounded focus:ring-zinc-500 focus:ring-2"
            />
          </div>
          <label
            htmlFor="compliance"
            className="text-sm text-zinc-700 font-medium leading-relaxed"
          >
            I agree to the Terms of Service and Privacy Policy. I understand
            that my content will be processed by AI to generate LinkedIn posts,
            and I can delete my data at any time.
          </label>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-white rounded-xl border border-zinc-200">
        <div className="flex items-center space-x-2 mb-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-zinc-900">
            Data Security
          </span>
        </div>
        <p className="text-xs text-zinc-600">
          Your documents are encrypted and stored securely
        </p>
      </div>

      <div className="p-4 bg-white rounded-xl border border-zinc-200">
        <div className="flex items-center space-x-2 mb-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-zinc-900">
            GDPR Compliant
          </span>
        </div>
        <p className="text-xs text-zinc-600">
          Full data control and deletion rights
        </p>
      </div>
    </div>
  </div>
);

export default ComplianceStep;
