import { useState, useEffect } from 'react'
import { useUPI } from '../contexts/UPIContext'
import EnterUPIID from './EnterUPIID'
import PaymentQR from './PaymentQR'

// Add this SVG component at the top of the file
const EditIcon = () => (
  <svg 
    className="w-4 h-4" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
    />
  </svg>
)

const TrashIcon = () => (
  <svg 
    className="w-4 h-4" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
    />
  </svg>
);

const BackspaceIcon = () => (
  <svg 
    className="w-6 h-6" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2H10.828a2 2 0 01-1.414-.586L3 12z"
    />
  </svg>
);

const Calculator = () => {
    const { upiId } = useUPI()
    const [showUPIPopup, setShowUPIPopup] = useState(false)
    const [display, setDisplay] = useState('0')
    const [preview, setPreview] = useState('0')
    const [showQR, setShowQR] = useState(false)
    const [frequentAmounts, setFrequentAmounts] = useState(() => {
        // Initialize from localStorage or default to empty array
        const saved = localStorage.getItem('frequentAmounts');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (!upiId) {
            setShowUPIPopup(true)
        }
    }, [upiId])

    useEffect(() => {
        calculatePreview()
    }, [display])

    const calculatePreview = () => {
        if (!display || display === '0') {
            setPreview('0')
            return
        }

        try {
            const cleanExpr = display.trim().replace(/[+\-*/]$/, '')
            if (cleanExpr === '') {
                setPreview('0')
                return
            }
            
            const result = eval(cleanExpr)
            setPreview(result.toString())
        } catch (error) {
            setPreview('...')
        }
    }

    const handleNumber = (number) => {
        if (display === '0') {
            setDisplay(number)
        } else {
            setDisplay(display + number)
        }
    }

    const handleOperator = (operator) => {
        if (/[+\-*/]$/.test(display)) {
            setDisplay(display.slice(0, -1) + operator)
        } else {
            setDisplay(display + operator)
        }
    }

    const handleEqual = () => {
        try {
            const result = eval(display)
            setDisplay(result.toString())
            setPreview(result.toString())
            addToFrequentAmounts(result)
            setShowQR(true)
        } catch (error) {
            setDisplay('Error')
            setPreview('0')
        }
    }

    const handleClear = () => {
        setDisplay('0')
        setPreview('0')
    }

    const addToFrequentAmounts = (amount) => {
        const newAmount = parseFloat(amount);
        if (isNaN(newAmount)) return;

        setFrequentAmounts(prev => {
            // Remove duplicates and keep only unique values
            const newAmounts = Array.from(new Set([...prev, newAmount]))
                .sort((a, b) => a - b)  // Sort numerically
                .slice(-5);  // Keep only last 5 amounts
            
            // Save to localStorage
            localStorage.setItem('frequentAmounts', JSON.stringify(newAmounts));
            return newAmounts;
        });
    };

    const handleFrequentAmount = (amount) => {
        setPreview(amount.toString());
        setShowQR(true);
    };

    // Add this function to remove an amount
    const removeFrequentAmount = (amountToRemove) => {
        setFrequentAmounts(prev => {
            const newAmounts = prev.filter(amount => amount !== amountToRemove);
            localStorage.setItem('frequentAmounts', JSON.stringify(newAmounts));
            return newAmounts;
        });
    };

    const clearAllFrequentAmounts = () => {
        setFrequentAmounts([]);
        localStorage.removeItem('frequentAmounts');
    };

    const handleBackspace = () => {
        if (display === '0' || display.length === 1) {
            setDisplay('0');
        } else {
            setDisplay(display.slice(0, -1));
        }
    };

    return (
        <div className="min-h-screen min-w-full bg-black flex items-center justify-center relative">
            {/* UPI Popup */}

            {showUPIPopup && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 md:p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowUPIPopup(false)
                        }
                    }}
                >
                    <div className="relative w-full h-full md:w-auto md:h-auto">
                        <EnterUPIID onClose={() => setShowUPIPopup(false)} />
                    </div>
                </div>
            )}

            {/* Payment QR Popup */}
            {showQR && (
                <PaymentQR 
                    amount={preview} 
                    upiId={upiId}
                    onClose={() => setShowQR(false)}
                />
            )}

            {/* Calculator UI */}
            <div className="w-full flex flex-col gap-2 h-screen md:h-auto md:w-80 bg-gray-900 p-4 md:p-6 md:rounded-2xl md:shadow-2xl md:border md:border-gray-700">
                {/* UPI ID Display */}
                <div onClick={() => setShowUPIPopup(true)} className="mt-4 lg:mt-0 bg-gray-800 p-3 mb-4 rounded-xl text-sm text-gray-300 font-mono shadow-inner border border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-100">{upiId}</span>
                    </div>
                    <button 
                        
                        className="text-gray-400 hover:text-gray-100 transition-colors duration-200"
                        title="Edit UPI ID"
                    >
                        <EditIcon />
                    </button>
                </div>

                {/* Frequent Amounts */}
                {frequentAmounts.length > 0 && (
                    <div className="min-h-[30px] flex flex-row overflow-x-auto gap-2 pb-2 mb-2">
                        {frequentAmounts.map((amount) => (
                            <div key={amount} className="w-full h-fit flex-row justify-between items-center relative group">
                                <button
                                    onClick={() => handleFrequentAmount(amount)}
                                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 active:bg-gray-900 
                                             text-gray-300 rounded-lg text-sm border border-gray-700"
                                >
                                    ₹{amount}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFrequentAmount(amount);
                                    }}
                                    className="absolute -top-1 -right-1 hidden group-hover:block 
                                             w-4 h-4 bg-red-800 text-white rounded-full text-xs"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={clearAllFrequentAmounts}
                            className="h-fit px-2 py-1 bg-red-800 hover:bg-red-700 active:bg-red-900 
                                     text-gray-200 rounded-lg border border-red-900 flex items-center"
                            title="Clear all frequent amounts"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                )}

                {/* Main Display */}
                <div className="h-full max-h-1/2 bg-gray-800 p-4 mb-2 rounded-xl text-right break-all whitespace-normal overflow-wrap overflow-y-auto text-2xl lg:min-h-[60px] text-gray-100 font-mono shadow-inner border border-gray-700">
                    {display}
                </div>
                {/* Preview Display */}
                <div className="bg-gray-800 p-4 mb-4 rounded-xl text-right lg:min-h-[24px] flex flex-row justify-between items-center text-4 text-gray-400 font-mono shadow-inner border border-gray-700">
                    <div>Total</div>
                    <div>{preview}</div>
                </div>
                
                {/* Calculator Buttons */}
                <div className="h-fit grid grid-cols-4 gap-3 flex-1">
                    {/* Clear and Backspace buttons */}
                    <button 
                        onClick={handleClear} 
                        className="aspect-square bg-red-800 active:bg-red-900 text-white rounded-xl transition-colors duration-200 shadow-lg border border-red-900 flex items-center justify-center text-lg"
                    >
                        Clear
                    </button>

                    <button 
                        onClick={handleBackspace}
                        className="aspect-square bg-red-800 active:bg-red-900 text-white rounded-xl transition-colors duration-200 shadow-lg border border-red-900 flex items-center justify-center"
                    >
                        <BackspaceIcon />
                    </button>

                    {/* Operator buttons */}
                    <button 
                        onClick={() => handleOperator('/')} 
                        className="aspect-square bg-indigo-800 active:bg-indigo-900 text-white rounded-xl transition-colors duration-200 shadow-lg border border-indigo-900 flex items-center justify-center text-xl"
                    >
                        ÷
                    </button>
                    <button 
                        onClick={() => handleOperator('*')} 
                        className="h-full bg-indigo-800 active:bg-indigo-900 text-white rounded-xl transition-colors duration-200 shadow-lg border border-indigo-900 flex items-center justify-center text-xl"
                    >
                        ×
                    </button>

                    {/* Number buttons */}
                    {[7, 8, 9].map((num) => (
                        <button 
                            key={num} 
                            onClick={() => handleNumber(num.toString())} 
                            className="aspect-square bg-gray-800 active:bg-gray-900 text-gray-200 rounded-xl transition-colors duration-200 shadow-lg border border-gray-900 flex items-center justify-center text-xl"
                        >
                            {num}
                        </button>
                    ))}

                    <button 
                        onClick={() => handleOperator('-')} 
                        className="aspect-square bg-indigo-800 active:bg-indigo-900 text-white rounded-xl transition-colors duration-200 shadow-lg border border-indigo-900 flex items-center justify-center text-xl"
                    >
                        -
                    </button>

                    {[4, 5, 6].map((num) => (
                        <button 
                            key={num} 
                            onClick={() => handleNumber(num.toString())} 
                            className="aspect-square bg-gray-800 active:bg-gray-900 text-gray-200 rounded-xl transition-colors duration-200 shadow-lg border border-gray-900 flex items-center justify-center text-xl"
                        >
                            {num}
                        </button>
                    ))}
                    <button 
                        onClick={() => handleOperator('+')} 
                        className="aspect-square bg-indigo-800 active:bg-indigo-900 text-white rounded-xl transition-colors duration-200 shadow-lg border border-indigo-900 flex items-center justify-center text-xl"
                    >
                        +
                    </button>

                    {[1, 2, 3].map((num) => (
                        <button 
                            key={num} 
                            onClick={() => handleNumber(num.toString())} 
                            className="aspect-square bg-gray-800 active:bg-gray-900 text-gray-200 rounded-xl transition-colors duration-200 shadow-lg border border-gray-900 flex items-center justify-center text-xl"
                        >
                            {num}
                        </button>
                    ))}

                    {/* Equals button */}
                    <button 
                        onClick={handleEqual} 
                        className="row-span-2 bg-green-800 active:bg-green-900 text-white rounded-xl transition-colors duration-200 shadow-lg border border-green-900 flex items-center justify-center text-xl"
                    >
                        =
                    </button>

                    <button 
                        onClick={() => handleNumber('0')} 
                        className="col-span-2 aspect-[2/1] bg-gray-800 active:bg-gray-900 text-gray-200 rounded-xl transition-colors duration-200 shadow-lg border border-gray-900 flex items-center justify-center text-xl"
                    >
                        0
                    </button>
                    <button 
                        onClick={() => handleNumber('.')} 
                        className=" bg-gray-800 active:bg-gray-900 text-gray-200 rounded-xl transition-colors duration-200 shadow-lg border border-gray-900 flex items-center justify-center text-xl"
                    >
                        .
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Calculator
