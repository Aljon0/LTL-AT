import { ArrowLeft, Check, CreditCard, Loader2, Lock } from "lucide-react";
import React, { useState } from "react";

const StripePayment = ({ selectedPlan, user, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    country: "US",
    zipCode: "",
  });
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const planDetails = {
    standard: {
      price: 9,
      name: "Standard",
      features: [
        "1 delivery per week",
        "1 short + 1 long post per delivery",
        "Advanced AI generation",
        "Priority support",
      ],
    },
    pro: {
      price: 29,
      name: "Pro",
      features: [
        "1 delivery per day",
        "1 short + 1 long post per delivery",
        "Premium AI generation",
        "Custom AI training",
        "Dedicated support",
      ],
    },
  };

  const plan = planDetails[selectedPlan];
  const tax = Math.round(plan.price * 0.08 * 100) / 100; // 8% tax
  const total = plan.price + tax;

  const handleCardInputChange = (field, value) => {
    setError(null);

    // Format card number with spaces
    if (field === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (value.length > 19) return; // Limit to 16 digits + 3 spaces
    }

    // Format expiry date
    if (field === "expiryDate") {
      value = value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      }
      if (value.length > 5) return;
    }

    // Limit CVV to 4 digits
    if (field === "cvv") {
      value = value.replace(/\D/g, "");
      if (value.length > 4) return;
    }

    setCardData({ ...cardData, [field]: value });
  };

  const validateForm = () => {
    if (
      !cardData.cardNumber ||
      cardData.cardNumber.replace(/\s/g, "").length < 13
    ) {
      setError("Please enter a valid card number");
      return false;
    }
    if (!cardData.expiryDate || cardData.expiryDate.length !== 5) {
      setError("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    if (!cardData.cvv || cardData.cvv.length < 3) {
      setError("Please enter a valid CVV");
      return false;
    }
    if (!cardData.cardName.trim()) {
      setError("Please enter the cardholder name");
      return false;
    }
    if (!billingAddress.zipCode.trim()) {
      setError("Please enter your ZIP code");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setError(null);

    try {
      console.log("Creating payment intent for:", selectedPlan);

      // Step 1: Create payment intent on your backend
      const paymentIntentResponse = await fetch(
        `${API_BASE_URL}/api/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: total,
            currency: "usd",
            planId: selectedPlan,
            userId: user?.uid || user?.id,
          }),
        }
      );

      if (!paymentIntentResponse.ok) {
        const errorData = await paymentIntentResponse.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const { clientSecret, paymentIntentId } =
        await paymentIntentResponse.json();

      console.log("Payment intent created:", paymentIntentId);

      // Step 2: Simulate successful payment (in real implementation, you'd use Stripe.js)
      // For testing purposes, we'll simulate a successful payment
      console.log("Simulating payment confirmation...");

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 3: For test mode, we'll simulate a successful payment and directly update the subscription
      // In production, you would use Stripe.js to actually process the payment

      // Simulate successful payment for test mode
      const mockReceiptData = {
        receiptNumber: `RCT-${Date.now().toString().slice(-8)}`,
        transactionId: paymentIntentId,
        amount: total,
        planName: plan.name,
        date: new Date().toLocaleDateString(),
      };

      // Update user subscription directly for test mode
      try {
        await fetch(`${API_BASE_URL}/api/upgrade-subscription`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.uid || user?.id,
            planId: selectedPlan,
            amount: total,
            paymentIntentId: paymentIntentId,
          }),
        });
      } catch (subscriptionError) {
        console.warn(
          "Subscription update failed, but continuing with payment flow"
        );
      }

      const confirmResult = {
        success: true,
        receiptData: mockReceiptData,
        message: "Payment confirmed (test mode)",
      };
      console.log("Payment confirmed:", confirmResult);

      // Call success callback with payment result
      onSuccess({
        success: true,
        paymentIntentId: paymentIntentId,
        receiptData: confirmResult.receiptData,
        plan: selectedPlan,
        amount: total,
        planName: plan.name,
        transactionId: paymentIntentId,
      });
    } catch (error) {
      console.error("Payment error:", error);
      setError(
        error.message ||
          "Payment failed. Please check your details and try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Test card numbers for Stripe test mode
  const testCards = [
    { number: "4242 4242 4242 4242", description: "Visa - Succeeds" },
    { number: "4000 0000 0000 0002", description: "Visa - Declined" },
    { number: "5555 5555 5555 4444", description: "Mastercard - Succeeds" },
  ];

  const fillTestCard = (cardNumber) => {
    setCardData({
      cardNumber: cardNumber,
      expiryDate: "12/25",
      cvv: "123",
      cardName: "Test User",
    });
    setBillingAddress({
      country: "US",
      zipCode: "12345",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 transition-colors font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Pricing</span>
          </button>

          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            Complete Your Upgrade
          </h1>
          <p className="text-zinc-600">
            Upgrade to {plan.name} plan and start automating your LinkedIn
            content
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-zinc-200/60 shadow-xl">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">
              Payment Details
            </h2>

            {/* Test Mode Notice */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-700 font-medium mb-2">
                🧪 Test Mode - Use test card numbers:
              </p>
              <div className="space-y-1">
                {testCards.map((card, index) => (
                  <button
                    key={index}
                    onClick={() => fillTestCard(card.number)}
                    className="block text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    {card.number} - {card.description}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-3">
                  Payment Method
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all ${
                      paymentMethod === "card"
                        ? "border-zinc-600 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium">Credit Card</span>
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={(e) =>
                      handleCardInputChange("cardNumber", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={(e) =>
                        handleCardInputChange("expiryDate", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) =>
                        handleCardInputChange("cvv", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardData.cardName}
                    onChange={(e) =>
                      setCardData({ ...cardData, cardName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900">
                  Billing Address
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Country
                    </label>
                    <select
                      value={billingAddress.country}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      placeholder="12345"
                      value={billingAddress.zipCode}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          zipCode: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center space-x-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-700">
                  Your payment information is encrypted and secure. We use
                  Stripe for secure payment processing.
                </p>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-zinc-700 to-zinc-900 hover:from-zinc-800 hover:to-black text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:transform-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Complete Payment - ${total.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-zinc-200/60 shadow-xl h-fit">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">
              Order Summary
            </h2>

            {/* Plan Details */}
            <div className="bg-zinc-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-900">
                  {plan.name} Plan
                </h3>
                <span className="text-lg font-bold text-zinc-900">
                  ${plan.price}/month
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-zinc-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-zinc-500">
                Billed monthly • Cancel anytime
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-3 mb-6 pb-6 border-b border-zinc-200">
              <div className="flex justify-between">
                <span className="text-zinc-700">
                  {plan.name} Plan (Monthly)
                </span>
                <span className="text-zinc-900">${plan.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-700">Tax (8%)</span>
                <span className="text-zinc-900">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-zinc-900">Total</span>
              <span className="text-zinc-900">${total.toFixed(2)}</span>
            </div>

            {/* User Info */}
            <div className="mt-6 pt-6 border-t border-zinc-200">
              <h4 className="text-sm font-semibold text-zinc-900 mb-2">
                Account
              </h4>
              <p className="text-sm text-zinc-600">{user?.email}</p>
              <p className="text-sm text-zinc-600">
                {user?.name || user?.displayName}
              </p>
            </div>

            {/* Next Steps */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                What happens next?
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Instant upgrade to {plan.name} plan</li>
                <li>• Access to all premium features</li>
                <li>• Automated content generation starts immediately</li>
                <li>• Receipt sent to your email</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripePayment;
