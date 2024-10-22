type Props = {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  tags?: string[];
};

const OpenGraphHeadTags = (props: Props) => {
  const { title, description, imageUrl, url, tags = [] } = props;
  return (
    <>
      <link rel="canonical" href={url} />
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta name="format-detection" content="telephone=no" />
      {/*{ <!-- Google / Search Engine Tags -->}*/}
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="author" content="@madole" />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="keywords" content={tags.join(", ")} />

      {/*{  <!-- Facebook Meta Tags -->}*/}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      {/*{ <!-- Twitter Meta Tags -->}*/}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="madole.xyz" />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      <meta name="twitter:image" content={imageUrl} />
    </>
  );
};

export default OpenGraphHeadTags;
