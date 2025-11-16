import React from "react";

export const Ul = (
  props: React.ComponentPropsWithoutRef<'ul'>,
) => {
  const { children } = props;
  return (
    <ul {...props} className="list-disc ml-6">
      {children}
    </ul>
  );
};
