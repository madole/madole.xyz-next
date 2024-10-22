import js from "@eslint/js";


export default [
  {
    ignores: [
      "*/js",
      "*/node_modules",
      "*/coverage",
      "out",
      ".next",
      "scripts",
      "tailwind.config.js",
      "postcss.config.js",
      "next.config.js",
    ],
  },
  js.configs.recommended,
];
