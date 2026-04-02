// src/hooks/useGrocery.ts
import { useQuery } from '@tanstack/react-query';
import { GROCERY_ITEMS } from '@/constants/data';

export function useGrocery(search: string, category: string, sortBy: string) {
  return useQuery({
    queryKey: ['grocery', search, category, sortBy],
    queryFn: () => {
      let items = [...GROCERY_ITEMS];

      //  Filter by Search
      if (search) items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

      //  Filter by Category
      if (category !== 'All') items = items.filter(i => i.category === category);

      //  Sort
      if (sortBy === 'price-low') items.sort((a, b) => a.price - b.price);
      if (sortBy === 'price-high') items.sort((a, b) => b.price - a.price);

      return items;
    },
  });
}