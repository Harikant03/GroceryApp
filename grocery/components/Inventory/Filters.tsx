"use client";

interface FiltersProps {
  setSearch: (val: string) => void;
  setCategory: (val: string) => void;
  setSort: (val: string) => void;
}

export default function Filters({ setSearch, setCategory, setSort }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <input 
        type="text"
        placeholder="Search items..." 
        className="border p-2 rounded flex-1 min-w-[200px] shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        onChange={e => setSearch(e.target.value)} 
      />
      <select className="border p-2 rounded bg-white shadow-sm" onChange={e => setCategory(e.target.value)}>
        <option value="All">All Categories</option>
        <option value="Fruits">Fruits</option>
        <option value="Dairy">Dairy</option>
        <option value="Bakery">Bakery</option>
      </select>
      <select className="border p-2 rounded bg-white shadow-sm" onChange={e => setSort(e.target.value)}>
        <option value="none">Sort By</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}