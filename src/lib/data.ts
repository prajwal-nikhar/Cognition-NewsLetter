import type { Timestamp } from 'firebase/firestore';

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorId: string;
  authorAvatar: {
    url: string;
    hint: string;
  };
  date: Timestamp | Date | string;
  category: string;
  tags: string[];
  image: {
    url: string;
    hint: string;
  };
  featured: boolean;
  content: string;
};

export const CATEGORIES = ['AI', 'Big Data', 'Machine Learning', 'Technology', 'Data Visualization'];
