import * as React from "react";

export const Hr = (): React.ReactElement => (
  <div className="flex justify-center p-1">
    <hr className="text-gray-500 w-2/3 h-px" />
  </div>
);

export const Spacer = (): React.ReactElement => <div className="p-2" />;

interface Label {
  color: string;
  text: string;
}

interface Props {
  labels?: Label[];
  children: React.ReactNode;
  onClick?: () => void;
}

const Label = (props: Label) => {
  const { color, text } = props;

  return (
    <div
      className="my-2 px-2 py-1 w-1/3 text-center mb-2 text-white font-bold rounded-xl"
      style={{ backgroundColor: color }}
    >
      {text}
    </div>
  );
};

const Card = (props: Props): React.ReactElement => {
  const { children, labels = [], onClick } = props;
  return (
    <div
      className="bg-white p-3 rounded-xl my-1 text-xs hover:bg-gray-100 shadow flex flex-col"
      draggable
      onClick={() => onClick && onClick()}
    >
      {children}
      {labels.map((label) => (
        <Label key={label.text} text={label.text} color={label.color} />
      ))}
    </div>
  );
};

export default Card;
