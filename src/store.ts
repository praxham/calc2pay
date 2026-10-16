import { create } from "zustand";
import type { bill } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";
import CryptoJS from "crypto-js";

type BillStore = {
  bills: bill[] | [];
  addBill: (newBill: bill) => void;
  deleteBill: (id: bill["id"]) => void;
  deleteAll: () => void;
};

const ENCRYPTION_KEY = process.env.BUN_PUBLIC_ENCRYPTION_KEY;

const encryptedStorage = {
  getItem: (name: string) => {
    const encryptedStr = localStorage.getItem(name);
    if (!encryptedStr) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedStr,
        ENCRYPTION_KEY as string,
      );
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    const encryptedStr = CryptoJS.AES.encrypt(
      value,
      ENCRYPTION_KEY as string,
    ).toString();
    localStorage.setItem(name, encryptedStr);
  },
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const useBillStore = create<BillStore>()(
  persist(
    (set) => ({
      bills: [],
      addBill: (newBill) =>
        set((state) => ({ bills: [...state.bills, newBill] })),
      deleteBill: (id) =>
        set((state) => ({
          bills: state.bills.filter((bill) => bill.id !== id),
        })),
      deleteAll: () => set({ bills: [] }),
    }),
    {
      name: "bills",
      storage: createJSONStorage(() => encryptedStorage),
    },
  ),
);

type UPIIdStore = {
  upiId: string | "";
  updateUpiId: (newUpiId: string) => void;
};

export const useUPIIdStore = create<UPIIdStore>()(
  persist(
    (set) => ({
      upiId: "",
      updateUpiId: (newUpiId) => set({ upiId: newUpiId }),
    }),
    {
      name: "userUpiId",
      storage: createJSONStorage(() => encryptedStorage),
    },
  ),
);

type UserDetailsStore = {
  isPremium: boolean;
  updateIsPremium: (val: boolean) => void;
  extraUpiIds: string[];
  updateExtraUpiIds: (newUpiId: string, oldUpiId?: string) => void;
  deleteExtraUpiId: (upiId: string) => void;
  storeName: string;
  updateStoreName: (name: string) => void;
};

export const useUserDetailsStore = create<UserDetailsStore>()(
  persist(
    (set) => ({
      isPremium: false,
      updateIsPremium: (val) => set({ isPremium: val }),
      extraUpiIds: [],
      updateExtraUpiIds: (newUpiId, oldUpiId) =>
        set((state) => {
          if (oldUpiId) {
            return {
              extraUpiIds: state.extraUpiIds.map((id) =>
                id === oldUpiId ? newUpiId : id,
              ),
            };
          }
          return { extraUpiIds: [...state.extraUpiIds, newUpiId] };
        }),
      deleteExtraUpiId: (upiId) =>
        set((state) => ({
          extraUpiIds: state.extraUpiIds.filter((id) => id !== upiId),
        })),
      storeName: "",
      updateStoreName: (name) => set({ storeName: name }),
    }),
    {
      name: "userPreference",
      storage: createJSONStorage(() => encryptedStorage),
    },
  ),
);
// import { createRoot } from "react-dom/client";
// createRoot(document.getElementById("root")!).render(<h1 style={{color:"white"}}>hello</h1>);
