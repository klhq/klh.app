export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  readingMinutes?: number;
  links?: { github?: string; demo?: string };
  tags: string[];
  image?: string;
  draft?: boolean;
};

export type Post = PostMeta & {
  content: string;
};
