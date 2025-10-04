"use client";
import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useGetAllCategory } from "../modules/categories/api";
import { useDebounce } from "../hooks/useDebounce";
import Link from "next/link";
import Image from "next/image";

export function SearchPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const debounce = useDebounce(searchQuery, 500);

  const { data, isLoading } = useGetAllCategory({
    limit: "10",
    page: "1",
    search: debounce,
  });

  const categoryData = data?.data.data ?? [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategoryClick = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md transition-colors hover:bg-accent text-foreground"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4">
            {/* Search Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-card-foreground">
                Search Products
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-accent text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  autoFocus
                />
              </div>
            </form>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                </div>
              ) : categoryData.length > 0 ? (
                <div className="space-y-1">
                  {categoryData.map((cat) => {
                    const brandHref = `/order/${cat.brand
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`;
                    return (
                      <Link
                        key={cat.id}
                        href={brandHref}
                        onClick={handleCategoryClick}
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors group"
                      >
                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          {cat.thumbnail ? (
                            <Image
                              src={cat.thumbnail}
                              alt={cat.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Search className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {cat.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {cat.brand}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No results found</p>
                  <p className="text-xs mt-1">Try different keywords</p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Start typing to search</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
