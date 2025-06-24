import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Optionally add hreflang links here for multilingual support */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
