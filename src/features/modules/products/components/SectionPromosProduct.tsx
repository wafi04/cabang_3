"use client";
import { ProductReseller } from "@/features/types/products";
import { FormatCurrency } from "@/utils/format";
import { Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetPromos } from "../api";

// ========================================
// SKELETON COMPONENT
// ========================================
function PromoCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 animate-pulse">
      <div className="relative rounded-xl overflow-hidden border border-border bg-card h-full">
        <div className="aspect-video bg-secondary relative" />
        <div className="p-4 space-y-3">
          <div className="h-5 bg-secondary rounded w-3/4" />
          <div className="h-4 bg-secondary rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-4 bg-secondary rounded w-1/3" />
            <div className="h-6 bg-secondary rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// PROMO CARD COMPONENT
// ========================================
function PromoCard({ promo }: { promo: ProductReseller }) {
  const normalPrice = promo.hargaJual || promo.hargaModal;
  const promoPrice = promo.hargaPromo;
  const discountPercentage = Math.round(
    ((normalPrice - promoPrice) / normalPrice) * 100
  );
  const savingsAmount = normalPrice - promoPrice;

  return (
    <Link
      href={`/order/${promo.brand?.toLowerCase().replace(/\s+/g, "-") || ""}`}
      className="flex-shrink-0 w-72 group block"
    >
      <div className="relative rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:shadow-xl bg-card h-full transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="aspect-video bg-secondary relative overflow-hidden">
          {promo.categoryThumbnail ? (
            <Image
              width={400}
              height={225}
              src={promo.categoryThumbnail}
              alt={promo.productName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-primary/10 to-secondary/10">
              🎮
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Discount Badge */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Flame className="h-4 w-4" />
            {discountPercentage}% OFF
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-full border border-border">
            {promo.categoryName}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {promo.productName}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground line-through">
                {FormatCurrency(normalPrice)}
              </span>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium px-2 py-1 rounded-md">
                Hemat {FormatCurrency(savingsAmount)}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {FormatCurrency(promoPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ========================================
// MAIN COMPONENT
// ========================================
export function SectionPromosProduct() {
  const { data, isLoading } = useGetPromos({ limit: "100", page: "1" });
  const promos = data?.data?.data || [];

  if (!isLoading && (!promos || promos.length === 0)) return null;

  // Duplicate promos for seamless loop
  const duplicatedPromos = [...promos, ...promos];

  return (
    <section className="relative overflow-hidden px-4 py-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-gradient-to-r from-primary to-orange-500 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              PROMO SPESIAL
            </h2>
            <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-primary rounded-full"></div>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Dapatkan penawaran terbaik untuk produk gaming favorit Anda
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
            {isLoading ? (
              <div className="flex gap-6 animate-marquee">
                {Array.from({ length: 8 }, (_, i) => (
                  <PromoCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
                {duplicatedPromos.map((promo, index) => (
                  <PromoCard
                    key={`${promo.productName}-${index}`}
                    promo={promo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
