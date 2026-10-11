export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  readingMinutes?: number;
  links?: { github?: string; demo?: string };
  series?: { id: string; title: string; order: number };
  tags: string[];
  image?: string;
  draft?: boolean;
};

export type Post = PostMeta & {
  content: string;
};
