type Props = {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
};

const OpenGraphHeadTags = (props: Props) => {
  const { title, description, imageUrl, url } = props;
  return (
    <>
      {/*{ <!-- HTML Meta Tags -->}*/}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/*{  <!-- Facebook Meta Tags -->}*/}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/*{<!--*/}
      {/*    You can generate this image URL dynamically: https://ogcdn.net/2c2c6737-47d4-4459-9969-e711eb48394c/v1/{site_text}/{title_text}/{description_text}/{image_url}/og.png*/}
      {/*    Replace the variables in the brackets with your own values and use this URL in the image tag below this comment. Ensure values are URL encoded.*/}
      {/*    For more information, read: https://www.opengraph.xyz/blog/how-to-implement-dynamic-open-graph-images*/}
      {/*    -->}*/}
      <meta property="og:image" content={imageUrl} />

      {/*{ <!-- Twitter Meta Tags -->}*/}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="madole.xyz" />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/*{<!--*/}
      {/*    You can generate this image URL dynamically: https://ogcdn.net/2c2c6737-47d4-4459-9969-e711eb48394c/v1/{site_text}/{title_text}/{description_text}/{image_url}/og.png*/}
      {/*    Replace the variables in the brackets with your own values and use this URL in the image tag below this comment. Ensure values are URL encoded.*/}
      {/*    For more information, read: https://www.opengraph.xyz/blog/how-to-implement-dynamic-open-graph-images*/}
      {/*    -->}*/}
      <meta name="twitter:image" content={imageUrl} />

      {/*{<!-- Meta Tags Generated via https://www.opengraph.xyz -->}*/}
    </>
  );
};

export default OpenGraphHeadTags;
