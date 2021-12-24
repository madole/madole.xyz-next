import * as React from 'react';

export const Hr = (): JSX.Element => (
    <div className="flex justify-center p-1">
        <hr className="text-gray-500 w-2/3 h-px" />
    </div>
);

export const Spacer = (): JSX.Element => <div className="p-2" />;

interface Label {
    color: string;
    text: string;
}

interface Props {
    labels?: Label[]
    children: React.ReactNode
    onClick?: () => void
}

const Label = (props: Label) => {
    const { color, text } = props;

    return (
        <div
            className="px-2 py-1 w-1/3 text-center mb-2 text-white font-bold rounded-sm"
            style={{ backgroundColor: color }}
        >
            {text}
        </div>
    );
};

const Card = (props: Props): JSX.Element => {
    const { children, labels = [], onClick } = props;
    return (
        <div className="bg-white p-2 rounded-sm my-1 text-xs hover:bg-gray-100 shadow flex flex-col" draggable
             onClick={() => onClick && onClick()}>
            {
                labels.map((label) => (
                    <Label key={label.text} text={label.text} color={label.color} />
                ))
            }
            {children}
        </div>
    );
};

export default Card;