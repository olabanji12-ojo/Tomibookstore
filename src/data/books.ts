// data/books.ts — Static book inventory for Good Things Co Ltd
import type { Product } from '../types';

export const products: Product[] = [
  {
    id: 'book-1',
    name: 'CURIOSITY & THE CAT',
    author: 'ELIZA VANCE',
    price: 18500,
    image: '/Goodthings1.jpg',
    images: ['/Goodthings1.jpg'],
    description: 'An experimental narrative exploring the boundaries of feline independence and the human condition in the digital age.',
    category: 'Productivity',
    featured: true
  },
  {
    id: 'gt2',
    name: 'STILLNESS IN MOTION',
    author: 'MARCUS CHEN',
    price: 9500,
    image: '/Goodthings2.jpg',
    images: ['/Goodthings2.jpg'],
    description: 'Explore the journey of intentional living through a collection of life-changing perspectives.',
    category: 'Lifestyle',
    featured: true
  }
];

// Alias for transition
export const books = products;
