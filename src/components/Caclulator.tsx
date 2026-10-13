import { useState } from "react";
import StyledButton from "./common/StyledButton";
import { useBillStore } from "@/store";
import type { bill } from "@/types";

const Caclulator = () => {
  const [equation, setEquation] = useState("");
  const addBill = useBillStore((state) => state.addBill);
  const bills = useBillStore((state) => state.bills);
  console.log({ bills });

  return (
    <div className="md:min-w-[20vw] mt-auto text-2xl font-semibold flex flex-col gap-4">
      <textarea
        defaultValue={equation}
        className="w-full   text-[3rem] px-4 py-2 rounded-(--corner-radius) border-(--clr-border-grey-two) border"
      />
      {bills.length > 0 && (
        <a
          className="ml-auto w-fit py-1 px-2 bg-(--clr-grey-one) rounded-(--corner-radius) text-[0.87rem]"
          href="/transactions"
        >
          View Transactions
        </a>
      )}
      <div className="grid grid-cols-4 gap-1">
        {buttons.map((key) => (
          <StyledButton
            key={key}
            title={key.toString()}
            action={() => {
              if (key === "AC") {
                clearAll(setEquation);
              } else if (key === "⌫") {
                backspace(setEquation);
              } else if (key === "=") {
                calculate(equation, setEquation, addBill);
              } else if (key === "( )") {
                if (equation.includes("(")) {
                  setEquation((prev) => (prev += ")"));
                } else {
                  setEquation((prev) => (prev += "("));
                }
              } else {
                setEquation((prev) => (prev += key));
              }
            }}
            heirarchy={key === "=" || key === "AC" ? "primary" : "secondary"}
            style={{
              width: "100%",
              fontSize: key === "⌫" ? "2rem" : "3rem",
              fontWeight: "500",
              aspectRatio: "1/1",
              borderRadius: "100px",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const buttons = [
  "AC",
  "( )",
  "%",
  "÷",
  7,
  8,
  9,
  "×",
  4,
  5,
  6,
  "−",
  1,
  2,
  3,
  "+",
  0,
  ".",
  "⌫",
  "=",
];

const clearAll = (
  setEquation: React.Dispatch<React.SetStateAction<string>>,
) => {
  setEquation("");
};

const backspace = (
  setEquation: React.Dispatch<React.SetStateAction<string>>,
) => {
  setEquation((prev) => prev.slice(0, -1));
};

const calculate = (
  equation: string,
  setEquation: React.Dispatch<React.SetStateAction<string>>,
  addBill: (bill: bill) => void,
) => {
  try {
    const evaluableEquation = equation
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");

    const total = eval(evaluableEquation);

    const listItems: string[] = [];
    const deductions: string[] = [];

    const plusParts = equation.split("+");

    plusParts.forEach((part) => {
      if (part.includes("−")) {
        const minusParts = part.split("−");
        if (minusParts[0] !== "") {
          listItems.push(minusParts[0] as string);
        }
        for (let i = 1; i < minusParts.length; i++) {
          if (minusParts[i] !== "") {
            deductions.push(minusParts[i] as string);
          }
        }
      } else {
        if (part !== "") {
          listItems.push(part);
        }
      }
    });

    const id = crypto.randomUUID();

    const date = new Date().toISOString();

    const newBill = {
      id,
      items: listItems,
      deductions,
      total: Number(total),
      date,
    };

    addBill(newBill);

    setEquation(total.toString());
  } catch (error) {
    console.error(error);

    setEquation("Error");
  }
};

export default Caclulator;
