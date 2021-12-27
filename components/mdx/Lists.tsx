import { ClassAttributes, HTMLAttributes } from "react";

export const Ul = (
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLUListElement> &
    HTMLAttributes<HTMLUListElement>
) => {
  const { children, ...rest } = props;
  return (
    <ul {...props} className="list-disc ml-6">
      {children}
    </ul>
  );
};
