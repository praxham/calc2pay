import { useState } from "react";
import StyledButton from "./common/StyledButton";
import { useUPIIdStore } from "@/store";

const UPIIdPopUp = ({
  onSave,
  handleClose,
}: {
  onSave: () => void;
  handleClose?: () => void;
}) => {
  const [upiId, setUpiId] = useState("");
  const updateUpiId = useUPIIdStore((state) => state.updateUpiId);
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
            updateUpiId(upiId);
            onSave();
          }}
          className="flex flex-col items-center gap-2"
        >
          <label className="w-full font-medium">UPI ID</label>
          <input
            className="w-full px-4 py-2 rounded-(--corner-radius) border-(--clr-border-grey-two) border"
            id="upiID"
            name="upiId"
            placeholder="Enter your UPI ID"
            type="text"
            value={upiId}
            pattern={UPI_REGEX.source}
            title="Please enter a valid UPI ID (e.g., username@bank)"
            required
            onChange={(e) => setUpiId(e.target.value)}
          />
          <div className="mt-1" />
          <StyledButton
            title={handleClose ? "Update Upi ID" : "Add UPI ID"}
            action={() => {}}
            heirarchy="primary"
            length="full-width"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
};

export const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,50}@[a-zA-Z]{2,}$/;

export default UPIIdPopUp;
