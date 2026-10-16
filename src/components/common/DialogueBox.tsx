import StyledButton from "./StyledButton";

const DialogueBox = ({
  title,
  subtitle,
  handleClose,
  confirmFunction,
}: {
  title: string;
  subtitle: string;
  handleClose: () => void;
  confirmFunction: () => void;
}) => {
  return (
    <div className="fixed w-screen h-screen text-[1rem] font-normal">
      <div
        onClick={handleClose}
        className="fixed top-0 left-0 w-screen h-screen bg-black/50"
      />
      <div className="fixed w-[calc(100vw-2rem)] lg:min-w-[500px] max-w-[600px] min-h-[200px] top-[50%] left-[50%] transform-[translate(-50%,-50%)] rounded-[var(--corner-radius)] p-4 flex flex-col items-center gap-2 bg-(--clr-grey-two)">
        <h1 className="heading1 w-full">{title}</h1>
        <span className="font-medium text-gray-300 w-full">{subtitle}</span>
        <div className="w-full grid grid-cols-2 gap-2 mt-auto">
          <StyledButton
            title="Close"
            action={handleClose}
            length="full-width"
            heirarchy="secondary"
            style={{
              color: "black",
              backgroundColor: "white",
              borderColor: "black",
            }}
          />
          <StyledButton
            title="Confirm"
            action={confirmFunction}
            length="full-width"
            heirarchy="primary"
            style={{
              backgroundColor: "#b23636",
              color: "white",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DialogueBox;
