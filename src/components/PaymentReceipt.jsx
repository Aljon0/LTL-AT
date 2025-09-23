import {
  Calendar,
  Check,
  CreditCard,
  Download,
  Printer,
  User,
} from "lucide-react";
import React, { useState } from "react";

const PaymentReceipt = ({ paymentData, user, onContinue }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const receiptData = {
    receiptNumber:
      paymentData?.receiptData?.receiptNumber ||
      `RCT-${Date.now().toString().slice(-8)}`,
    transactionId:
      paymentData?.transactionId ||
      paymentData?.receiptData?.transactionId ||
      `txn_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    planName: paymentData?.planName || "Standard",
    amount: paymentData?.amount || 0,
    tax: Math.round((paymentData?.amount || 0) * 0.08 * 100) / 100,
    subtotal:
      (paymentData?.amount || 0) -
      Math.round((paymentData?.amount || 0) * 0.08 * 100) / 100,
  };

  // Generate HTML content for PDF/Print
  const generateReceiptHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt - ${receiptData.receiptNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #27272a; 
            background: white;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        .header { 
            background: linear-gradient(135deg, #18181b, #27272a); 
            color: white; 
            padding: 32px; 
            border-radius: 16px;
            margin-bottom: 32px;
        }
        .header .company { 
            display: flex; 
            align-items: center; 
            margin-bottom: 16px; 
        }
        .header .logo { 
            width: 48px; 
            height: 48px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 12px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            margin-right: 16px;
            font-weight: bold;
            font-size: 20px;
        }
        .header h1 { font-size: 28px; font-weight: bold; margin-bottom: 4px; }
        .header p { color: #d4d4d8; }
        .receipt-number { 
            text-align: right; 
            position: absolute; 
            top: 32px; 
            right: 32px; 
        }
        .receipt-number p:first-child { 
            color: #d4d4d8; 
            font-size: 14px; 
        }
        .receipt-number p:last-child { 
            font-size: 24px; 
            font-weight: bold; 
        }
        .content { margin-bottom: 32px; }
        .details-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 32px; 
            margin-bottom: 32px; 
        }
        .detail-section h3 { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px; 
            display: flex; 
            align-items: center; 
        }
        .detail-section h3::before { 
            content: ''; 
            width: 20px; 
            height: 20px; 
            margin-right: 8px; 
            background: #e4e4e7; 
            border-radius: 4px; 
        }
        .detail-item { 
            margin-bottom: 8px; 
            font-size: 14px; 
        }
        .detail-item span:first-child { 
            font-weight: 500; 
            margin-right: 8px; 
        }
        .plan-details { 
            background: #f9fafb; 
            padding: 24px; 
            border-radius: 12px; 
            margin-bottom: 24px; 
        }
        .plan-details h3 { 
            font-size: 18px; 
            margin-bottom: 16px; 
        }
        .plan-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 16px; 
        }
        .plan-item h4 { 
            font-weight: 600; 
            margin-bottom: 4px; 
        }
        .plan-item p { 
            font-size: 14px; 
            color: #6b7280; 
        }
        .pricing { margin-bottom: 24px; }
        .pricing-item { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 12px; 
            color: #374151; 
        }
        .pricing-total { 
            display: flex; 
            justify-content: space-between; 
            font-size: 20px; 
            font-weight: bold; 
            padding-top: 12px; 
            border-top: 2px solid #e5e7eb; 
            margin-top: 12px; 
        }
        .company-info { 
            border-top: 1px solid #e5e7eb; 
            padding-top: 24px; 
            margin-top: 24px; 
        }
        .company-info h4 { 
            font-weight: 600; 
            margin-bottom: 8px; 
        }
        .company-info p { 
            font-size: 14px; 
            color: #6b7280; 
            margin-bottom: 4px; 
        }
        @media print {
            body { padding: 20px; }
            .header { background: #18181b !important; -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header" style="position: relative;">
        <div class="company">
            <div class="logo">TL</div>
            <div>
                <h1>ThoughtLeader AI</h1>
                <p>Premium Subscription</p>
            </div>
        </div>
        <div class="receipt-number">
            <p>Receipt #</p>
            <p>${receiptData.receiptNumber}</p>
        </div>
    </div>

    <div class="content">
        <div class="details-grid">
            <div class="detail-section">
                <h3>Customer Information</h3>
                <div class="detail-item">
                    <span>Name:</span> ${
                      user?.name || user?.displayName || "N/A"
                    }
                </div>
                <div class="detail-item">
                    <span>Email:</span> ${user?.email || "N/A"}
                </div>
                <div class="detail-item">
                    <span>User ID:</span> ${user?.uid || user?.id || "N/A"}
                </div>
            </div>

            <div class="detail-section">
                <h3>Payment Details</h3>
                <div class="detail-item">
                    <span>Transaction ID:</span> ${receiptData.transactionId}
                </div>
                <div class="detail-item">
                    <span>Payment Date:</span> ${receiptData.date}
                </div>
                <div class="detail-item">
                    <span>Payment Method:</span> Credit Card
                </div>
            </div>
        </div>

        <div class="plan-details">
            <h3>Subscription Details</h3>
            <div class="plan-item">
                <div>
                    <h4>${receiptData.planName} Plan</h4>
                    <p>Monthly Subscription</p>
                </div>
                <div style="font-size: 18px; font-weight: bold;">
                    $${receiptData.subtotal.toFixed(2)}
                </div>
            </div>
            <p style="color: #059669; font-size: 14px;">
                Next billing date: ${new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
            </p>
        </div>

        <div class="pricing">
            <div class="pricing-item">
                <span>Subtotal</span>
                <span>$${receiptData.subtotal.toFixed(2)}</span>
            </div>
            <div class="pricing-item">
                <span>Tax (8%)</span>
                <span>$${receiptData.tax.toFixed(2)}</span>
            </div>
            <div class="pricing-total">
                <span>Total Paid</span>
                <span>$${receiptData.amount.toFixed(2)}</span>
            </div>
        </div>

        
    </div>
</body>
</html>`;
  };

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);

    try {
      // Generate the HTML content
      const htmlContent = generateReceiptHTML();

      // Create a blob with the HTML content
      const blob = new Blob([htmlContent], { type: "text/html" });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${receiptData.receiptNumber}.html`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);

      // For PDF generation, you could integrate with libraries like jsPDF or html2pdf
      // Here's an example using html2pdf if you want to add it:
      /*
      if (window.html2pdf) {
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        
        const opt = {
          margin: 0.5,
          filename: `receipt-${receiptData.receiptNumber}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        await window.html2pdf().set(opt).from(element).save();
      }
      */
    } catch (error) {
      console.error("Error downloading receipt:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintReceipt = async () => {
    setIsPrinting(true);

    try {
      // Create a new window with the receipt content
      const printWindow = window.open("", "_blank");
      const htmlContent = generateReceiptHTML();

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          setIsPrinting(false);
        }, 250);
      };

      // Fallback in case onload doesn't fire
      setTimeout(() => {
        if (printWindow && !printWindow.closed) {
          printWindow.print();
          printWindow.close();
        }
        setIsPrinting(false);
      }, 1000);
    } catch (error) {
      console.error("Error printing receipt:", error);
      setIsPrinting(false);
    }
  };

  const handleEmailReceipt = async () => {
    try {
      console.log("Sending receipt email to:", user?.email);

      // You could implement this by calling your backend
      // const response = await fetch('/api/send-receipt-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userEmail: user?.email,
      //     receiptData: receiptData,
      //     htmlContent: generateReceiptHTML()
      //   })
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmailSent(true);

      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Welcome to the {receiptData.planName} plan! Your subscription is now
            active and you can start enjoying all the premium features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Receipt */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Receipt Header */}
              <div className="bg-gradient-to-r from-zinc-700 to-zinc-900 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">TL</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">ThoughtLeader AI</h2>
                        <p className="text-zinc-200">Premium Subscription</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-200 text-sm">Receipt #</p>
                    <p className="text-xl font-bold">
                      {receiptData.receiptNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-8">
                {/* Transaction Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Customer Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-zinc-700">
                        <span className="font-medium">Name:</span>{" "}
                        {user?.name || user?.displayName}
                      </p>
                      <p className="text-zinc-700">
                        <span className="font-medium">Email:</span>{" "}
                        {user?.email}
                      </p>
                      <p className="text-zinc-700">
                        <span className="font-medium">User ID:</span>{" "}
                        {user?.uid || user?.id}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-zinc-700">
                        <span className="font-medium">Transaction ID:</span>{" "}
                        {receiptData.transactionId}
                      </p>
                      <p className="text-zinc-700">
                        <span className="font-medium">Payment Date:</span>{" "}
                        {receiptData.date}
                      </p>
                      <p className="text-zinc-700">
                        <span className="font-medium">Payment Method:</span>{" "}
                        Credit Card
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="bg-zinc-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                    Subscription Details
                  </h3>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-semibold text-zinc-900">
                        {receiptData.planName} Plan
                      </p>
                      <p className="text-sm text-zinc-600">
                        Monthly Subscription
                      </p>
                    </div>
                    <p className="text-lg font-bold text-zinc-900">
                      ${receiptData.subtotal.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 text-emerald-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Next billing date:{" "}
                      {new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-zinc-700">
                    <span>Subtotal</span>
                    <span>${receiptData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-700">
                    <span>Tax (8%)</span>
                    <span>${receiptData.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-zinc-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-zinc-900">
                      <span>Total Paid</span>
                      <span>${receiptData.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions & Next Steps */}
          <div className="space-y-6">
            {/* Download & Print Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                Receipt Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handleDownloadReceipt}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-zinc-100 cursor-pointer hover:bg-zinc-200 text-zinc-900 rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
                      <span>Generating File...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Receipt</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrintReceipt}
                  disabled={isPrinting}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                  {isPrinting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
                      <span>Opening Print...</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4" />
                      <span>Print Receipt</span>
                    </>
                  )}
                </button>
              </div>

              {emailSent && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm text-emerald-700 text-center">
                    Receipt sent to {user?.email}
                  </p>
                </div>
              )}
            </div>

            {/* What's Next */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/60 shadow-xl">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                What's Next?
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">
                      1
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">
                      Access Premium Features
                    </p>
                    <p className="text-sm text-zinc-600">
                      All {receiptData.planName} features are now available in
                      your dashboard
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">
                      2
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">
                      Enhanced Automation
                    </p>
                    <p className="text-sm text-zinc-600">
                      Your content generation limits have been increased
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">
                      3
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">Premium Support</p>
                    <p className="text-sm text-zinc-600">
                      Priority customer support is now available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={onContinue}
              className="w-full py-4 px-6 bg-gradient-to-r from-zinc-700 to-zinc-900 hover:from-zinc-800 hover:to-black text-white rounded-xl transition-all duration-200 shadow-lg cursor-pointer hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            >
              Continue to Dashboard
            </button>

            {/* Support Info */}
            <div className="text-center text-sm text-zinc-500">
              <p>Need help? Contact us at</p>
              <p className="font-medium text-zinc-700">
                linkedin.tool0@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
