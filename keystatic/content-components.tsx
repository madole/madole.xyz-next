import { fields } from "@keystatic/core";
import {
  block,
  inline,
  mark,
  repeating,
  wrapper,
} from "@keystatic/core/content-components";
import Callout from "../components/mdx/Callout";
import MermaidRenderer from "../components/mdx/MermaidRenderer";
import StatusBadge from "../components/mdx/StatusBadge";

const highlightEditorStyles = {
  yellow: { backgroundColor: "#fef3c7", color: "#422006" },
  blue: { backgroundColor: "#e0f2fe", color: "#082f49" },
  green: { backgroundColor: "#d1fae5", color: "#064e3b" },
  red: { backgroundColor: "#fee2e2", color: "#7f1d1d" },
  mono: {
    backgroundColor: "#f1f5f9",
    color: "#0f172a",
    fontFamily: "monospace",
  },
  fluorescent: { backgroundColor: "#ccff00", color: "#0f172a" },
} as const;

export const blogContentComponents = {
  StatusBadge: inline({
    label: "StatusBadge",
    schema: {
      status: fields.select({
        label: "Status",
        options: [
          { label: "Updated", value: "updated" },
          { label: "Deprecated", value: "deprecated" },
          { label: "Experimental", value: "experimental" },
          { label: "Stable", value: "stable" },
          { label: "Beta", value: "beta" },
          { label: "New", value: "new" },
        ],
        defaultValue: "updated",
      }),
    },
    ContentView: ({ value }) => <StatusBadge status={value.status} />,
  }),
  Highlight: mark({
    label: "Highlight",
    icon: <span>H</span>,
    schema: {
      variant: fields.select({
        label: "Variant",
        options: [
          { label: "Yellow", value: "yellow" },
          { label: "Blue", value: "blue" },
          { label: "Green", value: "green" },
          { label: "Red", value: "red" },
          { label: "Monospace", value: "mono" },
          { label: "Fluorescent", value: "fluorescent" },
        ],
        defaultValue: "yellow",
      }),
    },
    tag: "mark",
    style: ({ value }) => ({
      borderRadius: "0.25rem",
      padding: "0.125rem 0.25rem",
      ...highlightEditorStyles[value.variant],
    }),
  }),
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
    ContentView: ({ value, children }) => (
      <Callout tone={value.tone}>{children}</Callout>
    ),
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
