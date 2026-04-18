// data/books.ts — Static book inventory for Good Things Co Ltd
import type { Book } from '../types';

export const books: Book[] = [
  {
    id: 'gt1',
    title: 'Stories That Stay With You',
    author: 'Good Things Co',
    price: 9500,
    image: '/book1.jpg',
    description: 'A masterpiece curated for the modern reader who seeks depth and inspiration in every page.',
  },
  {
    id: 'gt2',
    title: 'The Art of Curated Living',
    author: 'Good Things Co',
    price: 9500,
    image: '/book2.jpg',
    description: 'Explore the journey of intentional living through a collection of life-changing perspectives.',
  }
];
