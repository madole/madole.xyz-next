import * as React from "react";

const AddAnotherCard = (): JSX.Element => {
  return (
    <div className="flex text-gray-600 hover:bg-gray-400 mt-2 p-1 rounded-sm items-center text-sm">
      <div className="pl-1 text-xl font-light">+</div>
      <div className="pl-1 ">Add another card</div>
    </div>
  );
};

interface Props {
  title: string;
  children: React.ReactNode;
}

const Column = (props: Props): JSX.Element => {
  const { title, children } = props;
  return (
    <div className="max-h-9/10 ">
      <div className="bg-gray-300 rounded-sm p-3 m-2 cursor-pointer flex flex-col max-h-almost-full">
        <div className="flex justify-between">
          <div className="font-bold p-1">{title}</div>
          <div className="hover:bg-gray-400 rounded-sm h-8 w-8 flex justify-center align-center">
            <div className="font-bold text-gray-600 leading-snug">...</div>
          </div>
        </div>
        <div
          className="overflow-y-auto max-h-almost-full"
          style={{ width: "272px" }}
        >
          <div className="flex flex-col align-center">{children}</div>
        </div>
        <AddAnotherCard />
      </div>
    </div>
  );
};

export default Column;
