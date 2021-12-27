const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

const blogQuestions = [
  {
    type: "input",
    name: "title",
    message: "What is the title of your blog post?",
  },
  {
    type: "input",
    message: "Add some tags?",
    name: "tags",
  },
];
const TILQuestions = [
  {
    type: "input",
    name: "title",
    message: "What is the title of your Today I learned post?",
  },
];

(async () => {
  const type = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "What type of post would you like to create?",
      choices: ["Blog", "TIL"],
    },
  ]);

  if (type.type === "Blog") {
    const { title, tags } = await inquirer.prompt(blogQuestions);

    const tagsArray = tags
      .split(",")
      .map((tag) => `'${tag.trim()}'`)
      .join(",");
    const date = new Date().toISOString();
    // make a slug from lowercase and replace spaces with dashes
    const slug = title.toLowerCase().replace(/\s/g, "-");
    const frontmatter = `---
title: '${title}'
date: '${date}'
tags: [${tagsArray}]
slug: '${slug}'
---
  `;
    // add a new file called slug + .mdx and write the frontmatter
    fs.writeFile(`./content/blog/${slug}.mdx`, frontmatter, (err) => {
      if (err) throw err;
      console.log(
        `Blog post created at file://${path.join(
          __dirname,
          `../content/blog/${slug}.mdx`
        )}`
      );
    });
  } else if (type.type === "TIL") {
    const { title } = await inquirer.prompt(TILQuestions);

    const date = new Date().toISOString();
    // make a slug from lowercase and replace spaces with dashes
    const slug = title.trim().toLowerCase().replace(/\s/g, "-");
    const frontmatter = `---
title: '${title}'
date: '${date}'
slug: '${slug}'
---
  `;
    // add a new file called slug + .mdx and write the frontmatter
    fs.writeFile(`./content/today-i-learned/${slug}.md`, frontmatter, (err) => {
      if (err) throw err;
      console.log(
        `Today I learned post created at file://${path.join(
          __dirname,
          `../content/today-i-learned/${slug}.md`
        )}`
      );
    });
  }
})();
