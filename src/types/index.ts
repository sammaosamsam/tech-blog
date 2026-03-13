export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  readTime: number;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}
