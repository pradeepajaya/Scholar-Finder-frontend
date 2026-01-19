import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
}

const popularFilters = [
  "Computer Science",
  "Medicine",
  "Physics",
  "Biology",
  "Engineering",
  "Mathematics",
  "Psychology",
  "Economics",
];

export function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleFilter = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter((f) => f !== filter)
      : [...activeFilters, filter];
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    onFilterChange([]);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search scholars by name, institution, or field..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl shadow-sm"
            />
          </div>
          <Button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="px-6 py-6 border-slate-300 hover:bg-slate-50 rounded-xl"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
            {activeFilters.length > 0 && (
              <Badge className="ml-2 bg-blue-600 hover:bg-blue-700 text-white">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">
                  Filter by Field
                </h3>
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {popularFilters.map((filter) => (
                  <Badge
                    key={filter}
                    onClick={() => toggleFilter(filter)}
                    className={`cursor-pointer transition-all ${
                      activeFilters.includes(filter)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeFilters.length > 0 && !showFilters && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-600">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
