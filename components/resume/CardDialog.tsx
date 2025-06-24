import { ReactNode } from "react";
import creditCard from "./credit-card.png";
import textWithLines from "./text-with-lines.png";
import closeButton from "./close-button.png";
import Image from "next/image";

interface CommentProps {
  date: string;
  columnName: string;
}

const Comment = (props: CommentProps) => {
  const { date, columnName } = props;
  return (
    <div className="flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://avatars1.githubusercontent.com/u/3341965?s=460&v=4"
        alt="avatar"
        className="rounded-full h-8 w-8 flex items-center justify-center"
      />
      <div className="flex flex-col ml-2">
        <div>
          <span className="font-bold">Andrew McDowell</span>
          <span> added this card to {columnName}</span>
        </div>
        <div className="text-gray-700 text-sm mt-1">{date}</div>
      </div>
    </div>
  );
};

const Input = () => {
  return (
    <div className="flex items-center my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://avatars1.githubusercontent.com/u/3341965?s=460&v=4"
        alt="avatar"
        className="rounded-full h-8 w-8 flex items-center justify-center"
      />
      <input
        className="ml-2 w-3/4 p-2 shadow rounded-sm"
        placeholder="Write a comment..."
      />
    </div>
  );
};

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  date: string;
  columnName: string;
  children: ReactNode;
}

const CardDialog = (props: Props): JSX.Element | null => {
  const { open, onClose, title, children, columnName, date } = props;

  if (!open) {
    return null;
  }

  return (
    <div
      className="z-50 absolute inset-0 bg-black bg-opacity-50 overflow-hidden flex justify-center items-center animate-fadeIn"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-gray-200 rounded p-6 mx-3 w-full md:w-1/2 relative flex flex-col h-4/5 text-base overflow-auto max-h-almost-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute top-2 right-2 p-2 text-black text-2xl hover:bg-gray-300 rounded flex items-center justify-center"
          onClick={onClose}
        >
          <div className="w-4 h-4 flex">
            <Image src={closeButton} alt="close" layout="intrinsic" />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 mr-2">
            <Image src={creditCard} alt="card" layout="intrinsic" />
          </div>
          <div className="text-xl font-bold mt-px" onClick={onClose}>
            {title}
          </div>
        </div>
        <div className="flex ml-8 text-gray-600 mt-1">
          in list{" "}
          <span
            className="ml-1 underline hover:text-gray-900"
            onClick={onClose}
          >
            {columnName}
          </span>
        </div>
        <div className="flex mt-6 flex items-center">
          <div className="w-4 mr-4">
            <Image
              src={textWithLines}
              alt="text with lines"
              layout="intrinsic"
            />
          </div>
          <div className="text-lg leading-normal">Description</div>
        </div>
        <div className="flex my-2 p-6 hover:bg-gray-300 rounded">
          {children}
        </div>
        <Input />
        <Comment date={date} columnName={columnName} />
      </div>
    </div>
  );
};

export default CardDialog;
