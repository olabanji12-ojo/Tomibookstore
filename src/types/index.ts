// types/index.ts — Global TypeScript interfaces

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  image: string;
}

export type OrderStatus = 'idle' | 'success';
