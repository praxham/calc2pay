import { useUPIIdStore, useUserDetailsStore } from "@/store";
import StyledButton from "./common/StyledButton";
import { useState } from "react";
import { toast } from "react-toastify";
import { UPI_REGEX } from "./UPIIdPopUp";

const Profile = () => {
  const isPremium = useUserDetailsStore((state) => state.isPremium);
  const {
    storeName,
    updateStoreName,
    extraUpiIds,
    updateExtraUpiIds,
    deleteExtraUpiId,
  } = useUserDetailsStore((state) => state);
  const upiId = useUPIIdStore((state) => state.upiId);
  const [storeNameValue, setStoreNameValue] = useState(storeName || "");
  const [upiIdsValue, setUpiIdsValue] = useState<string[]>(() => {
    const initial = [...(extraUpiIds || [])];

    if (initial.length === 0 && upiId) {
      initial.push(upiId);
    }

    while (initial.length < 4) {
      initial.push("");
    }

    return initial.slice(0, 4);
  });

  if (!isPremium) {
    window.location.href = "/";
  } else {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col items-center gap-2"
      >
        <label className="w-full font-medium">Store Name</label>
        <input
          className="w-full px-4 py-2 rounded-(--corner-radius) border-(--clr-border-grey-two) border"
          id="otp"
          name="otp"
          placeholder="Enter your Store Name (without spaces)"
          type="text"
          title="Please enter a single word without spaces"
          minLength={4}
          value={storeNameValue}
          pattern="^\S+$"
          onChange={(e) => {
            const newValue = e.target.value;
            if (/^\S*$/.test(newValue)) {
              setStoreNameValue(newValue);
            }
          }}
        />
        <div className="mt-1" />
        <StyledButton
          title={storeName.length > 0 ? "Update Store Name" : "Add Store Name"}
          action={() => {
            updateStoreName(storeNameValue);
            toast.success("Successfully updated Store Name");
          }}
          heirarchy="primary"
          length="full-width"
        />
        <label className="w-full font-medium mt-2">Other UPI Ids</label>
        {upiIdsValue.map((upiId, index) => (
          <input
            key={index}
            className="w-full px-4 py-2 rounded-(--corner-radius) border-(--clr-border-grey-two) border"
            id="upiID"
            name="upiId"
            placeholder="Enter your UPI ID"
            type="text"
            pattern={UPI_REGEX.source}
            title="Please enter a valid UPI ID (e.g., username@bank)"
            minLength={4}
            value={upiId}
            onChange={(e) => {
              const newUpiIds = [...upiIdsValue];
              newUpiIds[index] = e.target.value.trim();
              setUpiIdsValue(newUpiIds);
            }}
          />
        ))}
        <StyledButton
          title="Update UPI Ids"
          action={() => {
            upiIdsValue.forEach((newUpi, index) => {
              const oldUpi = extraUpiIds[index];

              if (newUpi !== oldUpi) {
                if (newUpi && oldUpi) {
                  updateExtraUpiIds(newUpi, oldUpi);
                } else if (newUpi && !oldUpi) {
                  updateExtraUpiIds(newUpi);
                } else if (!newUpi && oldUpi) {
                  deleteExtraUpiId(oldUpi);
                }
              }
            });
            toast.success("Successfully updated UPI Ids");
          }}
          heirarchy="primary"
          length="full-width"
        />
      </form>
    );
  }
};

export default Profile;
