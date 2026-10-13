import { create } from "zustand";
import type { bill } from "./types";

type BillStore = {
  bills: bill[] | [];
  addBill: (newBill: bill) => void;
  deleteBill: (id: bill["id"]) => void;
  deleteAll: () => void;
};

export const useBillStore = create<BillStore>((set) => ({
  bills: JSON.parse(localStorage.getItem("bills") || "[]"),
  addBill: (newBill) => {
    const rawOldBillsFromLS = localStorage.getItem("bills");

    let oldBills = rawOldBillsFromLS ? JSON.parse(rawOldBillsFromLS) : [];

    oldBills.flat(Infinity);

    const newBills = [...oldBills, newBill];

    localStorage.setItem("bills", JSON.stringify(newBills));
    set((state) => ({ bills: [...state.bills, newBill] }));
  },
  deleteBill: (id) => {
    set((state) => {
      const updatedBills = state.bills.filter((bill) => bill.id !== id);
      localStorage.setItem("bills", JSON.stringify(updatedBills));
      return { bills: updatedBills };
    });
  },
  deleteAll: () => {
    localStorage.removeItem("bills");
    set({ bills: [] });
  },
}));

type UPIIdStore = {
  upiIds: string[] | [];
  updateUpiId: (oldUpiId: string, newUpiId: string) => void;
  deleteUpiId: (id: string) => void;
};

// export const useUPIIdStore = create<UPIIdStore>((set) => ({
//   upiIds: [],
//   updateUpiId: (oldUpiId, newUpiId)={
//     set((state)=>)
//   }
// }));
