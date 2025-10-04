"use client";

import { useGetCategoryType } from "../api";
import { useFilterMain } from "../hooks";
import { Sparkles } from "lucide-react";

export function CategoriesChoices() {
  const { data, isLoading } = useGetCategoryType();
  const { setCategory, category: stateCategory } = useFilterMain();
  
  if (isLoading) {
    return (
      <section className="w-full mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 animate-pulse">
            <div className="h-8 bg-muted rounded-lg w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded-lg w-64"></div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-28 bg-muted rounded-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mx-auto  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center flex flex-col justify-center items-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3 h-3" />
            <span>Kategori Populer</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Pilih Kategori Game Favoritmu
          </h2>
         <p className="text-muted-foreground text-sm md:text-base">
            Temukan game favoritmu dari berbagai kategori yang tersedia
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3">
          {data?.data.map((category) => {
            const isActive = category === stateCategory;
            return (
              <button
                key={category}
                onClick={() => setCategory(category)}
                className={`
                  group relative px-6 py-2.5 rounded-full font-medium text-sm
                  transition-all duration-300 overflow-hidden
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                      : "bg-card border border-border hover:border-primary/50 hover:bg-primary/5"
                  }
                `}
              >
                {/* Shimmer effect on hover */}
                {!isActive && (
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                )}
                
                <span className="relative whitespace-nowrap">
                  {category}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-transparent animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        
      </div>
    </section>
  );
}