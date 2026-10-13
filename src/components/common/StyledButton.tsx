import type { IButton } from "@/types";

const StyledButton = ({
  title,
  action,
  heirarchy,
  length,
  isLoading = false,
  ...props
}: IButton) => {
  return (
    <button
      className={`flex items-center justify-center px-4 py-2 rounded-(--corner-radius) font-semibold cursor-pointer text-nowrap ${
        isLoading
          ? "bg-gray-400"
          : heirarchy === "primary"
            ? "  bg-(--clr-primary)"
            : "  bg-(--clr-grey-one) hover:bg-(--clr-grey-two)"
      } ${length === "full-width" ? "w-full" : "w-fit"}`}
      onClick={action}
      {...props}
    >
      {isLoading ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          width="36"
          height="24"
        >
          <circle
            fill="#000000"
            stroke="#000000"
            stroke-width="2"
            r="15"
            cx="35"
            cy="100"
          >
            <animate
              attributeName="cx"
              calcMode="spline"
              dur="2.2"
              values="35;165;165;35;35"
              keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1"
              repeatCount="indefinite"
              begin="0"
            ></animate>
          </circle>
          <circle
            fill="#000000"
            stroke="#000000"
            stroke-width="2"
            opacity=".8"
            r="15"
            cx="35"
            cy="100"
          >
            <animate
              attributeName="cx"
              calcMode="spline"
              dur="2.2"
              values="35;165;165;35;35"
              keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1"
              repeatCount="indefinite"
              begin="0.05"
            ></animate>
          </circle>
          <circle
            fill="#000000"
            stroke="#000000"
            stroke-width="2"
            opacity=".6"
            r="15"
            cx="35"
            cy="100"
          >
            <animate
              attributeName="cx"
              calcMode="spline"
              dur="2.2"
              values="35;165;165;35;35"
              keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1"
              repeatCount="indefinite"
              begin=".1"
            ></animate>
          </circle>
          <circle
            fill="#000000"
            stroke="#000000"
            stroke-width="2"
            opacity=".4"
            r="15"
            cx="35"
            cy="100"
          >
            <animate
              attributeName="cx"
              calcMode="spline"
              dur="2.2"
              values="35;165;165;35;35"
              keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1"
              repeatCount="indefinite"
              begin=".15"
            ></animate>
          </circle>
          <circle
            fill="#000000"
            stroke="#000000"
            stroke-width="2"
            opacity=".2"
            r="15"
            cx="35"
            cy="100"
          >
            <animate
              attributeName="cx"
              calcMode="spline"
              dur="2.2"
              values="35;165;165;35;35"
              keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1"
              repeatCount="indefinite"
              begin=".2"
            ></animate>
          </circle>
        </svg>
      ) : (
        title
      )}
    </button>
  );
};

export default StyledButton;
