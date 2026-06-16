import { fields } from "@keystatic/core";
import { block, wrapper } from "@keystatic/core/content-components";
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
};
