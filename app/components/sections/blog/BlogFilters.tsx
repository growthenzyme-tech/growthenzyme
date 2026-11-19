
import { Search } from "lucide-react";

type BlogFiltersProps = {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  search: string;
  setSearch: (value: string) => void;
};

export default function BlogFilters({
  categories,
  activeCategory,
  setActiveCategory,
  search,
  setSearch,
}: BlogFiltersProps) {
  return (
    <section className="bg-[#FFFDF8] px-6 py-7 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-[10px] font-bold uppercase tracking-[0.14em] transition ${
                activeCategory === category
                  ? "text-[#29382F]"
                  : "text-[#829181] hover:text-[#29382F]"
              }`}
            >
              {category}
              {activeCategory === category && (
                <span className="mt-1 block h-[2px] w-full bg-[#B6CBA9]" />
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-[230px]">
          <Search
            size={15}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-[#829181]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full border-b border-[#29382F]/20 bg-transparent py-2 pl-6 text-xs text-[#29382F] outline-none placeholder:text-[#829181] focus:border-[#506B59]"
          />
        </div>
      </div>
    </section>
  );
}
