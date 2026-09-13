import { createHighlighter } from "@tanstack/highlight/core";
import { css } from "@tanstack/highlight/languages/css";
import { html } from "@tanstack/highlight/languages/html";
import { js } from "@tanstack/highlight/languages/js";
import { json } from "@tanstack/highlight/languages/json";
import { jsx } from "@tanstack/highlight/languages/jsx";
import { markdown } from "@tanstack/highlight/languages/markdown";
import { shell } from "@tanstack/highlight/languages/shell";
import { ts } from "@tanstack/highlight/languages/ts";
import { tsx } from "@tanstack/highlight/languages/tsx";

// Registers only the languages this blog's code fences actually use, so the
// same synchronous registry can be imported unchanged by both the SSR MDX
// pipeline and any future client-side highlighting without diverging output.
export const highlighter = createHighlighter({
  languages: [css, html, js, json, jsx, markdown, shell, ts, tsx],
});
