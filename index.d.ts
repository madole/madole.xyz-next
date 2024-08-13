declare module "@mapbox/rehype-prism";

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}