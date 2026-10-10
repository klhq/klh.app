export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  readingMinutes?: number;
  tags: string[];
  image?: string;
  draft?: boolean;
};

export type Post = PostMeta & {
  content: string;
};
