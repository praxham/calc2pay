import { useState } from "react";
import BillList from "./components/BillList";
import Caclulator from "./components/Caclulator";
import UPIIdPopUp from "./components/UPIIdPopUp";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useUPIIdStore, useUserDetailsStore } from "./store";
import PremiumActivationPopup from "./components/PremiumActivationPopup";
import { Bounce, ToastContainer } from "react-toastify";
import Profile from "./components/Profile";

export function App() {
  const upiId = useUPIIdStore((state) => state.upiId);
  const [showEditUpiIdPopup, setShowEditUpiIdPopup] = useState(false);
  const [showBuyPremiumPopup, setShowBuyPremiumPopup] = useState(false);
  const isPremium = useUserDetailsStore((state) => state.isPremium);
  const extraUpiIds = useUserDetailsStore((state) => state.extraUpiIds);
  const updateUpiId = useUPIIdStore((state) => state.updateUpiId);

  const showUPIPOpup = !upiId || showEditUpiIdPopup;

  const handleUpiIdSaved = () => {
    setShowEditUpiIdPopup(false);
  };

  return (
    <div className="px-4 sm:px-0 sm:max-w-[60vw] lg:max-w-[40vw] xl:max-w-[20vw] h-[calc(100vh-2rem)] sm:mx-auto my-4 flex flex-col gap-2">
      <div className="relative flex flex-row gap-2 w-fit mx-auto">
        {window.location.pathname !== "/" && (
          <a
            href="/"
            className="w-fit py-1 px-4 border-(--clr-grey-two) border rounded-full text-[0.87rem]"
          >
            Calculator
          </a>
        )}
        {window.location.pathname !== "/bills" && (
          <a
            href="bills"
            className="w-fit py-1 px-4 border-(--clr-grey-two) border rounded-full text-[0.87rem]"
          >
            Bills
          </a>
        )}
        <div
          onClick={() => {
            if (isPremium) {
              window.location.href = "/profile";
            } else {
              setShowBuyPremiumPopup(true);
            }
          }}
          className="text-[0.87rem] text-amber-500 cursor-pointer py-1 px-4 border-amber-500 border rounded-full"
        >
          {isPremium ? "Profile" : "Buy Premium"}
        </div>
      </div>

      {upiId && (
        <div className="flex flex-row justify-between items-center gap-4 py-1">
          {isPremium && extraUpiIds?.length > 0 ? (
            <select
              // Added styling to make the select look clean and maintain the RTL truncation
              className="truncate bg-transparent outline-none cursor-pointer border-b border-gray-300 pb-1"
              value={upiId} // The currently active UPI ID
              onChange={(e) => updateUpiId(e.target.value)} // onChange goes on the <select> element
              title="Choose a UPI ID"
            >
              {/* If your primary upiId is NOT in the extraUpiIds array, you might want to add a default option here */}

              {extraUpiIds.map((id, index) => (
                <option key={index} value={id}>
                  {id}
                </option>
              ))}
            </select>
          ) : (
            <span className="truncate" title={upiId}>
              &lrm;{upiId}
            </span>
          )}
          {!isPremium && (
            <button
              onClick={() => setShowEditUpiIdPopup(true)}
              className="py-1 px-2 bg-(--clr-grey-one) rounded-(--corner-radius) text-[0.87rem] font-semibold cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>
      )}
      {showUPIPOpup && (
        <UPIIdPopUp
          onSave={handleUpiIdSaved}
          handleClose={
            showEditUpiIdPopup ? () => setShowEditUpiIdPopup(false) : undefined
          }
        />
      )}
      {showBuyPremiumPopup && (
        <PremiumActivationPopup
          handleClose={() => setShowBuyPremiumPopup(false)}
          onSave={() => {}}
        />
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Caclulator />} />
          <Route path="/bills" element={<BillList />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
