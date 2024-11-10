import { useUPI } from "../contexts/UPIContext";
import { useState } from "react";

const EnterUPIID = ({ onClose }) => {
  const { upiId, updateUPI } = useUPI();
  const [input, setInput] = useState(upiId);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUPI(input);
    if (onClose) onClose();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div 
        className="w-full h-fit md:h-auto md:w-auto p-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gray-800 h-full md:h-auto rounded-none md:rounded-xl shadow-lg p-6 border-0 md:border md:border-gray-700 flex flex-col">
          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            <div className="flex-1">
              <label
                htmlFor="upiId"
                className="block text-gray-300 mb-2 text-lg md:text-sm font-medium"
              >
                Enter UPI ID
              </label>
              <input
                type="text"
                id="upiId"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 md:py-2 text-gray-100 text-lg md:text-base focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="example@upi"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 md:py-2 px-4 rounded-lg transition-colors duration-200 font-medium text-lg md:text-base"
            >
              Save UPI ID
            </button>
          </form>

          {upiId && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-300">
                Current UPI:{" "}
                <span className="text-gray-100 font-medium">{upiId}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterUPIID;
