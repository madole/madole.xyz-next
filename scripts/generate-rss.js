const { Feed } = require("feed");
const fs = require("fs");
const path = require("path");
const frontmatter = require("front-matter");
const readingTime = require("reading-time");
const { marked } = require("marked");

/**
 * Left unset, the feed library stamps `updated` (and RSS 2.0's `lastBuildDate`)
 * with the current time, so every run of this script produces a diff even when
 * no post has changed. CI regenerates the feeds and auto-commits the result on
 * every pull request, which turned that into a "RSS feeds updated" commit per
 * push and a guaranteed conflict in rss.atom/rss.xml on every rebase.
 *
 * Deriving it from the newest post instead makes the output a pure function of
 * content/blog: the feeds only change when the posts do.
 */
const buildFeed = (updated) =>
  new Feed({
    title: "Madole.xyz Blog",
    description: "Blog posts from madole.xyz",
    id: "http://madole.xyz/",
    link: "http://madole.xyz/",
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: "http://madole.xyz/bitmoji.png",
    favicon: "http://madole.xyz/favicon.ico",
    copyright: "All rights reserved 2022, Madole",
    updated,
    feedLinks: {
      json: "https://madole.xyz/json",
      atom: "https://madole.xyz/atom",
    },
    author: {
      name: "Andrew McDowell",
      email: "me@madole.dev",
      link: "https://madole.xyz/",
    },
  });

const generateRss = () => {
  const filenames = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  const blogPostsMetadata = filenames
    .map((filename) => {
      // use frontmatter to read the titles of each blog post
      const file = fs.readFileSync(
        path.join(process.cwd(), "content/blog", filename),
        "utf8",
      );
      const data = frontmatter(file);
      const timeToRead = readingTime(data.body);
      return {
        ...data,
        ...data.attributes,
        timeToRead,
        exerpt: data.body.slice(0, 250),
        date: data.attributes.date.toString(),
        slug: filename.split(".mdx")[0],
      };
    })
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));

  // Sorted newest first, so the head post is the last time the feed changed.
  const feed = buildFeed(
    blogPostsMetadata.length ? new Date(blogPostsMetadata[0].date) : undefined
  );

  blogPostsMetadata.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: "https://madole.xyz/blog/" + post.slug,
      link: "https://madole.xyz/blog/" + post.slug,
      description: `Reading time: ${post.timeToRead.text}`,
      content: marked(post.exerpt),
      author: [
        {
          name: "Andrew McDowell",
          email: "me@madole.dev",
          link: "https://madole.xyz",
        },
      ],
      date: new Date(post.date),
    });
  });
  const rss = feed.rss2();
  fs.writeFileSync(path.join(process.cwd(), "public/rss.xml"), rss, {
    encoding: "utf8",
    flag: "w",
  });
  const atom = feed.atom1();
  fs.writeFileSync(path.join(process.cwd(), "public/rss.atom"), atom, {
    encoding: "utf8",
    flag: "w",
  });
  const json = feed.json1();
  fs.writeFileSync(path.join(process.cwd(), "public/rss.json"), json, {
    encoding: "utf8",
    flag: "w",
  });
};

generateRss();
