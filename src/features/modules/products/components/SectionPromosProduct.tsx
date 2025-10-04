"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductReseller } from "@/features/types/products";
import { FormatCurrency } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { useGetPromos } from "../api";

// ========================================
// SKELETON COMPONENT
// ========================================
function PromoCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 mx-3 animate-pulse">
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
  const sanitizeBrand = promo.brand.replace(/\s+/g, "-").toLowerCase();
  return (
    <Link
      href={`/order/${sanitizeBrand}`}
      key={promo.id}
      className="mx-4 hover:border-accent"
    >
      <Card className="w-[320px] overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-3">
          <div className="flex gap-3">
            {/* Image Section - Small on Left */}
            <div className="relative flex-shrink-0">
              <Image
                width={100}
                height={100}
                src={promo.categoryThumbnail}
                alt={promo.categoryName}
                className="w-20 h-20 object-cover rounded-md"
              />
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
                -{discountPercentage}%
              </Badge>
            </div>

            {/* Content Section - Right Side */}
            <div className="flex-1 space-y-2">
              <p className="font-medium text-sm line-clamp-2 leading-tight">
                {promo.productName}
              </p>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-red-500">
                    {FormatCurrency(promo.hargaPromo)}
                  </span>
                  <span className="line-through text-xs text-muted-foreground">
                    {FormatCurrency(promo.hargaJual)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ========================================
// MAIN COMPONENT with React Fast Marquee
// ========================================
export function SectionPromosProduct() {
  const { data, isLoading } = useGetPromos({ limit: "100", page: "1" });
  const promos = data?.data?.data || [];

  if (!isLoading && (!promos || promos.length === 0)) return null;

  return (
    <section className="relative overflow-hidden py-12 ">
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
        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 6 }, (_, i) => (
              <PromoCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <Marquee
            pauseOnHover={true}
            speed={40}
            gradient={true}
            gradientColor="hsl(var(--background))"
            gradientWidth={100}
          >
            {promos.map((promo, index) => (
              <PromoCard key={`${promo.productName}-${index}`} promo={promo} />
            ))}
          </Marquee>
        )}
      </div>
    </section>
  );
}
