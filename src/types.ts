import type { ButtonHTMLAttributes } from "react";
export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  action: () => void;
  heirarchy: "primary" | "secondary";
  length?: "full-width";
  isLoading?: boolean;
}

export type bill = {
  id: string;
  items: string[];
  deductions: string[];
  total: number;
  date: string;
};
