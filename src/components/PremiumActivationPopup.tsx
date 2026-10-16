import { useState } from "react";
import StyledButton from "./common/StyledButton";
import { toast } from "react-toastify";
import { useUserDetailsStore } from "@/store";

const PremiumActivationPopup = ({
  onSave,
  handleClose,
}: {
  onSave: () => void;
  handleClose: () => void;
}) => {
  const [productKey, setProductKey] = useState("");
  const updateIsPremium = useUserDetailsStore((state) => state.updateIsPremium);
  return (
    <div className="fixed w-screen h-screen text-[1rem] font-normal z-50">
      <div
        onClick={handleClose}
        className="fixed top-0 left-0 w-screen h-screen bg-black/50"
      />
      <div className="fixed max-w-100 w-[calc(100vw-2rem)] lg:w-125 top-[50%] left-[50%] transform-[translate(-50%,-50%)] flex flex-col gap-2 rounded-(--corner-radius) p-4 bg-white text-black border-(--clr-border-grey-one) border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="flex flex-col items-center gap-2"
        >
          <label className="w-full font-medium">
            Premium gives u access to:
          </label>
          <ul className="">
            {premiumFeatures.map((item, index) => (
              <li key={index} className="list-disc ml-4">
                {item}
              </li>
            ))}
          </ul>
          <StyledButton
            title="Buy Premium For ₹999"
            action={() =>
              window.open(
                "https://madeinvikhroli.com/artifacts/calc-2-pay-premium/?purchase=true",
                "_blank",
                "noopener,noreferrer",
              )
            }
            heirarchy="primary"
            length="full-width"
          />

          <label className="w-full font-medium">Product Key</label>
          <input
            className="w-full px-4 py-2 rounded-(--corner-radius) border-(--clr-border-grey-two) border"
            id="otp"
            name="otp"
            placeholder="Enter your product key"
            type="text"
            minLength={29}
            required
            value={productKey}
            onChange={(e) => setProductKey(e.target.value)}
          />
          <div className="mt-1" />
          <StyledButton
            title="Activate Premium"
            action={() =>
              validateProductKey(productKey, updateIsPremium, handleClose)
            }
            heirarchy="primary"
            length="full-width"
            type="submit"
            style={{
              backgroundColor: "var(--color-amber-500)",
              color: "black",
            }}
          />
        </form>
      </div>
    </div>
  );
};

const premiumFeatures = [
  "Download your monthly bills as a spreadsheet (CSV format) for easy bookkeeping.",

  "Add your store name to payment links so customers see your brand when paying.",

  "Save up to 5 different UPI accounts to easily switch between where you receive money.",

  `Get instant voice alerts ("Payment received") the moment a customer's payment is successful.`,
];

const validateProductKey = (
  productKey: string,
  updateIsPremium: (val: boolean) => void,
  handleClose: () => void,
) => {
  const PREMIUM_ACTIVATION_KEY = process.env.BUN_PUBLIC_PREMIUM_ACTIVATION_KEY;
  if (productKey === PREMIUM_ACTIVATION_KEY) {
    toast.success("Premium features unlocked successfully! 🎉");
    updateIsPremium(true);
    handleClose();
  } else {
    toast.error("Invalid product key. Please try again.");
  }
};

export default PremiumActivationPopup;
