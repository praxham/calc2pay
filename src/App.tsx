import { useEffect, useState } from "react";
import BillList from "./components/BillList";
import Caclulator from "./components/Caclulator";
import UPIIdPopUp from "./components/UPIIdPopUp";
import "./index.css";
import CryptoJS from "crypto-js";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export function App() {
  const userUpiId = getUPIIdFromLocalstorage();
  const [showEditUpiIdPopup, setShowEditUpiIdPopup] = useState(false);

  const showUPIPOpup = !userUpiId || showEditUpiIdPopup;

  return (
    <div className="md:max-w-[20vw] md:mx-auto my-4 flex flex-col gap-2">
      {userUpiId && (
        <div className="  flex flex-row justify-between items-center py-1">
          <span className="truncate">{userUpiId}</span>
          <button
            onClick={() => setShowEditUpiIdPopup(true)}
            className="py-1 px-2 bg-(--clr-grey-one) rounded-(--corner-radius) text-[0.87rem] font-semibold cursor-pointer"
          >
            Edit
          </button>
        </div>
      )}
      {showUPIPOpup && (
        <UPIIdPopUp
          handleClose={
            showEditUpiIdPopup ? () => setShowEditUpiIdPopup(false) : undefined
          }
        />
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Caclulator />} />
          <Route path="/transactions" element={<BillList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export const getUPIIdFromLocalstorage = () => {
  // 1. Retrieve the encrypted string from localStorage
  const encryptedData = localStorage.getItem("userUpiId"); // Ensure this matches your setItem key

  if (!encryptedData) return null;

  // 2. Access the encryption key using the correct Bun prefix
  const ENCRYPTION_KEY = process.env.BUN_PUBLIC_ENCRYPTION_KEY;

  if (!ENCRYPTION_KEY) {
    console.error("Encryption key is missing");
    return null;
  }

  try {
    // 3. Decrypt the data using the key
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);

    // 4. Convert the decrypted bytes back to a standard UTF-8 string
    const originalUpiId = bytes.toString(CryptoJS.enc.Utf8);

    return originalUpiId;
  } catch (error) {
    console.error("Failed to decrypt UPI ID:", error);
    return null;
  }
};

export default App;
