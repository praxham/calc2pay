import { useBillStore } from "@/store";
import BillItem from "./BillItem";
import { useState } from "react";
import DialogueBox from "./common/DialogueBox";

const BillList = () => {
  const bills = useBillStore((state) => state.bills);
  const deleteBill = useBillStore((state) => state.deleteBill);
  const [billToDelete, setBillToDelete] = useState("");

  if (bills?.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        <h1>Transactions</h1>
        {bills.map((bill) => (
          <BillItem
            key={bill.id}
            bill={bill}
            setBillToDelete={setBillToDelete}
          />
        ))}
        {billToDelete && (
          <DialogueBox
            title="Delete Bill ?"
            subtitle="are you sure want to delete this bill?"
            handleClose={() => setBillToDelete("")}
            confirmFunction={() => {
              deleteBill(billToDelete);
              setBillToDelete("");
            }}
          />
        )}
      </div>
    );
  } else {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <span className="font-semibold text-(--clr-grey-three)">
          No Transactions
        </span>
      </div>
    );
  }
};

export default BillList;
