import { useBillStore, useUserDetailsStore } from "@/store";
import BillItem from "./BillItem";
import { useState } from "react";
import DialogueBox from "./common/DialogueBox";
import { exportBillsToCSV } from "@/functions/exportBills";

const BillList = () => {
  const bills = useBillStore((state) => state.bills);
  const deleteBill = useBillStore((state) => state.deleteBill);
  const deleteAll = useBillStore((state) => state.deleteAll);
  const [billToDelete, setBillToDelete] = useState("");
  const [deleteAllBills, setDeleteAllBills] = useState(false);

  const billsNewToOld = [...bills].reverse();

  if (bills?.length > 0) {
    const isPremium = useUserDetailsStore((state) => state.isPremium);
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <h1>Transactions</h1>
          <div className="flex flex-row gap-4">
            {isPremium && (
              <span
                onClick={() => exportBillsToCSV(billsNewToOld)}
                className="text-white flex flex-row items-center gap-1 text-[0.87rem] cursor-pointer"
              >
                Export CSV
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g id="Interface / Download">
                      {" "}
                      <path
                        id="Vector"
                        d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>{" "}
                  </g>
                </svg>
              </span>
            )}
            <span
              onClick={() => setDeleteAllBills(true)}
              className="flex flex-row items-center gap-1 text-[0.87rem] font-semibold text-(--clr-danger) cursor-pointer"
            >
              <span className="mt-0.75">Delete All</span>
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16"
                    stroke="var(--clr-danger)"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            </span>
          </div>
        </div>

        {billsNewToOld.map((bill) => (
          <BillItem
            key={bill.id}
            bill={bill}
            setBillToDelete={setBillToDelete}
          />
        ))}
        {billToDelete && (
          <DialogueBox
            title="Delete Bill ?"
            subtitle="are you sure want to delete this bill ?"
            handleClose={() => setBillToDelete("")}
            confirmFunction={() => {
              deleteBill(billToDelete);
              setBillToDelete("");
            }}
          />
        )}
        {deleteAllBills && (
          <DialogueBox
            title="Delete All Bills ?"
            subtitle="are you sure want to delete all bills ?"
            handleClose={() => setBillToDelete("")}
            confirmFunction={() => {
              deleteAll();
            }}
          />
        )}
      </div>
    );
  } else {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <span className="font-semibold text-(--clr-grey-three)">No Bills</span>
      </div>
    );
  }
};

export default BillList;
