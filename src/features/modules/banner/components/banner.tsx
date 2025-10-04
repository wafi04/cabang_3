"use client";
import { useState } from "react";
import { UseGetBannersByBranchId } from "../api";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MainBanner() {
  const { data } = UseGetBannersByBranchId();
  const banners = data?.data ?? [];
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto my-4">
      {/* Tombol navigasi */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-accent/70 p-2 rounded-full shadow-md z-10 hover:bg-accent/90"
      >
        <ChevronLeft className="w-5 h-5 text-accent-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent/70 p-2 rounded-full shadow-md z-10 hover:bg-accnt/90"
      >
        <ChevronRight className="w-5 h-5 text-accent-foreground" />
      </button>

      {/* Carousel */}
      <div className="flex items-center justify-center gap-4">
        {banners.map((banner, index: number) => {
          // hitung posisi relative
          let position = "";
          if (index === current) position = "center";
          else if (index === (current - 1 + banners.length) % banners.length)
            position = "left";
          else if (index === (current + 1) % banners.length) position = "right";
          else position = "hidden";

          return (
            <div
              key={index}
              className={`
                transition-all duration-500 ease-in-out
                ${
                  position === "center"
                    ? "w-[70%] opacity-100 scale-100 z-20"
                    : position === "left" || position === "right"
                    ? "w-[15%] opacity-70 scale-90 z-10"
                    : "hidden"
                }
              `}
            >
              <Image
                src={banner.urlBanner}
                alt={`banner-${index}`}
                width={1200}
                height={400}
                className="w-full h-[220px] md:h-[320px] object-cover rounded-xl"
                priority={index === 0}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
