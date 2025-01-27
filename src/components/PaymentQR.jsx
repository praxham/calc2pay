import QRCode from "react-qr-code";

const PaymentQR = ({ amount, upiId, onClose }) => {
  const formatIndianNumber = (number) => {
    const numStr = number.toString();
    const parts = numStr.split(".");
    let integerPart = parts[0];
    const decimalPart = parts[1] ? "." + parts[1] : "";

    const isNegative = integerPart.startsWith("-");
    if (isNegative) {
      integerPart = integerPart.slice(1);
    }

    let formattedInteger = integerPart;
    if (integerPart.length > 3) {
      const last3Digits = integerPart.slice(-3);
      const remainingDigits = integerPart.slice(0, -3);
      formattedInteger =
        remainingDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
        "," +
        last3Digits;
    }

    return `${isNegative ? "-" : ""}${formattedInteger}${decimalPart}`;
  };

  const upiLink = `upi://pay?pa=${upiId}&am=${amount}&cu=INR`;

  const handleShare = async () => {
    const shareData = {
      title: "UPI Payment",
      text: `Pay ₹${formatIndianNumber(amount)} via UPI to ${upiId}. Link: ${upiLink}`, // Include the UPI link in text
    };
  
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(upiLink).then(() => {
        alert("Payment link copied to clipboard! You can share it manually.");
      });
    }
  };
  

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">
              Scan to Pay ₹{formatIndianNumber(amount)}
            </h2>
            <p className="text-sm text-gray-500">{upiId}</p>
          </div>

          <div className="p-4 bg-white">
            <QRCode value={upiLink} size={256} className="mx-auto" />
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <button
            className="w-full bg-blue-950 text-white py-2 px-4 rounded-md hover:bg-blue-800"
            onClick={handleShare}
          >
            Share Payment Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentQR;