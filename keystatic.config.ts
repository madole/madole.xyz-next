import { config, fields, collection } from '@keystatic/core';
import slugify from '@sindresorhus/slugify';
import { blogContentComponents } from './keystatic/content-components';

function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateTilSlug(name: string): string {
  const trimmed = name.trim();
  if (trimmed === '') {
    return `til-${getTodayDateString()}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `til-${trimmed}`;
  }
  return `til-${slugify(trimmed)}`;
}

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'content/blog/*',
      format: { contentField: 'content' },
      columns: ['date', 'title'],
      schema: {
        date: fields.date({
          label: 'Date',
          defaultValue: { kind: 'today' },
        }),
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'Slug',
            description: 'Used for the filename and URL path',
          },
        }),
        description: fields.text({ label: 'Description' }),
        og_image: fields.text({ label: 'OG Image' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
        }),
        content: fields.mdx({
          label: 'Content',
          extension: 'mdx',
          components: blogContentComponents,
          options: {
            image: {
              directory: 'public/blog-images',
              publicPath: '/blog-images',
            },
          },
        }),
      },
    }),
    todayILearned: collection({
      label: 'Today I Learned',
      slugField: 'title',
      path: 'content/today-i-learned/*',
      format: { contentField: 'content' },
      columns: ['date', 'title'],
      parseSlugForSort: (slug) => {
        const match = slug.match(/^til-(\d{4}-\d{2}-\d{2})/);
        return match ? match[1] : slug;
      },
      schema: {
        date: fields.date({
          label: 'Date',
          defaultValue: { kind: 'today' },
        }),
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'Slug',
            description:
              'Pre-filled as til-YYYY-MM-DD for today. Edit if posting for a different date.',
            generate: generateTilSlug,
            validation: {
              pattern: {
                regex: /^(til-\d{4}-\d{2}-\d{2}|[a-z][a-z0-9-]*)$/,
                message:
                  'Use til-YYYY-MM-DD for new posts (e.g. til-2024-06-16)',
              },
            },
          },
        }),
        url: fields.url({ label: 'Read more URL', validation: { isRequired: false } }),
        og_image: fields.text({ label: 'OG Image' }),
        content: fields.mdx({
          label: 'Content',
          extension: 'md',
          options: {
            image: {
              directory: 'public/blog-images',
              publicPath: '/blog-images',
            },
          },
        }),
      },
    }),
  },
});
