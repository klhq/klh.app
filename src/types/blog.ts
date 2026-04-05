export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  draft?: boolean;
};

export type Post = PostMeta & {
  content: string;
};
