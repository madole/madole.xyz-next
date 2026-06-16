import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../keystatic.config";

// Node-only Reader API. Must only be used inside getStaticProps / getStaticPaths.
export const reader = createReader(process.cwd(), keystaticConfig);
