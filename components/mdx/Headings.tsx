import * as React from "react";

export const H1 = (props: { [x: string]: any; children: any }) => {
  const { children, ...rest } = props;
  return (
    <h1 className="text-5xl font-bold" {...rest}>
      {children}
    </h1>
  );
};
export const H2 = (props: { [x: string]: any; children: any }) => {
  const { children, ...rest } = props;
  return (
    <h2 className="text-3xl font-bold" {...rest}>
      {children}
    </h2>
  );
};
export const H3 = (props: { [x: string]: any; children: any }) => {
  const { children, ...rest } = props;
  return (
    <h3 className="text-2xl font-bold" {...rest}>
      {children}
    </h3>
  );
};
export const H4 = (props: { [x: string]: any; children: any }) => {
  const { children, ...rest } = props;
  return (
    <h4 className="text-xl font-bold" {...rest}>
      {children}
    </h4>
  );
};

export const H5 = (props: { [x: string]: any; children: any }) => {
  const { children, ...rest } = props;
  return (
    <h5 className="text-xl" {...rest}>
      {children}
    </h5>
  );
};
