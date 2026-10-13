import type { bill } from "@/types";
import StyledButton from "./common/StyledButton";

const BillItem = ({
  bill,
  setBillToDelete,
}: {
  bill: bill;
  setBillToDelete: (id: string) => void;
}) => {
  return (
    <div className="bg-(--clr-grey-one) rounded-(--corner-radius) p-2">
      {bill?.items?.map((item, index) => (
        <li className=" list-none text-gray-200 flex flex-row items-center justify-between">
          <span>item {index + 1}</span>
          <span>₹{item}</span>
        </li>
      ))}
      {bill?.deductions?.map((item, index) => (
        <li className=" list-none text-gray-200 flex flex-row items-center justify-between">
          <span>item {index + 1}</span>
          <span>- ₹{item}</span>
        </li>
      ))}
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-semibold mt-1">Total:</h1>
        <span>₹{bill.total}</span>
      </div>
      <div className="flex flex-row gap-2 items-center mt-2">
        <StyledButton
          title="Print"
          action={() => {}}
          heirarchy="primary"
          length="full-width"
        />
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => setBillToDelete(bill.id)}
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
      </div>
    </div>
  );
};

export default BillItem;
