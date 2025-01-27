import Citation from "./Citation";
import ClickyThing from "./ClickyThing";
import Code from "./Code";
import Img from "./Img";
import Kbd from "./Kbd";
import MeetTheTeamBackup from "./MeetTheTeamBackup";
import Pre from "./Pre";
import RedText from "./RedText";

export const mdxComponents: import("mdx/types").MDXComponents = {
  RedText,
  ClickyThing,
  inlineCode: Code,
  MeetTheTeamBackup,
  Citation,
  Kbd,
  Img,
  pre: ({ children, ...props }) => <Pre {...props}>{children}</Pre>,
  // p: Paragraph,
  // h1: H1,
  // h2: H2,
  // h3: H3,
  // h4: H4,
  // h5: H5,
  // ul: Ul,
  // a: Hyperlink,
};
