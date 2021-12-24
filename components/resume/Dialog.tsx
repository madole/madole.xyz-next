import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const Dialog = (props: Props): JSX.Element | null => {
  const { open, onClose } = props;

  function emailMe() {
    if (typeof window === "undefined") return;
    window.location.href = "mailto:me@madole.dev?subject=Lets work together";
    onClose();
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 bg-black bg-opacity-50 overflow-hidden flex justify-center items-center animate-fadeIn z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded py-4 mx-3 w-full md:w-1/2 lg:w-1/3 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold px-8">Contact me</h2>
        <hr className="mt-4 h-px w-full" />
        <div className="mt-8 px-10">
          <div>
            <span>Drop me an email at: </span>
            <a
              className="text-blue-500 hover:text-blue-300"
              href="mailto:me@madole.dev?subject=Lets work together"
            >
              me@madole.dev
            </a>
          </div>
        </div>
        <div className="mt-10 flex justify-end  px-8">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={emailMe}
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Click to email me
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
