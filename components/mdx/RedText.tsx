import type { ReactNode } from "react";
import Callout from "./Callout";

export interface RedTextProps {
  children: ReactNode;
}

/** @deprecated Use `<Callout type="warning">` instead */
const RedText = (props: RedTextProps) => {
  return <Callout type="warning">{props.children}</Callout>;
};

export default RedText;
