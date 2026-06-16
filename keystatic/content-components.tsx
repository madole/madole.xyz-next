import { fields } from "@keystatic/core";
import { block, repeating, wrapper } from "@keystatic/core/content-components";
import MermaidRenderer from "../components/mdx/MermaidRenderer";

export const blogContentComponents = {
  Callout: wrapper({
    label: "Callout",
    schema: {
      tone: fields.select({
        label: "Tone",
        options: [
          { label: "Info", value: "info" },
          { label: "Warning", value: "warning" },
          { label: "Tip", value: "tip" },
          { label: "TIL", value: "til" },
        ],
        defaultValue: "info",
      }),
    },
  }),
  Mermaid: block({
    label: "Mermaid",
    schema: {
      source: fields.text({
        label: "Source",
        description: "Mermaid diagram definition",
        multiline: true,
      }),
      caption: fields.text({ label: "Caption" }),
    },
    ContentView: ({ value }) => (
      <MermaidRenderer source={value.source} caption={value.caption} />
    ),
  }),
  Figure: block({
    label: "Figure",
    schema: {
      image: fields.image({
        label: "Image",
        directory: "public/blog-images/figures",
        publicPath: "/blog-images/figures",
      }),
      alt: fields.text({ label: "Alt text" }),
      caption: fields.text({ label: "Caption" }),
    },
  }),
  Map: block({
    label: "Map",
    schema: {
      geojsonUrl: fields.url({ label: "GeoJSON URL" }),
      center: fields.text({
        label: "Center",
        description: "lng,lat (e.g. 151.21,-33.87)",
      }),
      zoom: fields.integer({ label: "Zoom", defaultValue: 8 }),
      styleUrl: fields.text({ label: "Basemap style URL" }),
    },
  }),
  Sandbox: block({
    label: "Sandbox",
    schema: {
      provider: fields.select({
        label: "Provider",
        options: [
          { label: "StackBlitz", value: "stackblitz" },
          { label: "CodeSandbox", value: "codesandbox" },
          { label: "CodePen", value: "codepen" },
        ],
        defaultValue: "stackblitz",
      }),
      id: fields.text({ label: "Embed ID" }),
      height: fields.integer({ label: "Height", defaultValue: 500 }),
    },
  }),
  CodeTab: wrapper({
    label: "Code Tab",
    schema: {
      label: fields.text({ label: "Tab label" }),
    },
  }),
  CodeGroup: repeating({
    label: "Code Group",
    children: ["CodeTab"],
    schema: {},
  }),
};
