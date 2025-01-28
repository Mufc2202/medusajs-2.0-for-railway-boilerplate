export type BLOG_TYPE = {
  title: string;
  subtitle?: string;
  handle: string;
  image?: string;
  content: string;
  categories?: string[];
};

export type UPDATE_BLOG_TYPE = {
  title?: string;
  subtitle?: string;
  handle?: string;
  image?: string;
  content?: string;
  categories?: string[];
};
