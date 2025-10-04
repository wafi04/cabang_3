import Image from "next/image";

export function BannerOrder({ image }: { image?: string }) {
  return (
    <div className="relative w-full">
      <Image
        alt="Banner"
        src={image || "/bgorder.png"}
        width={1000}
        height={300}
        fetchPriority="high"
        className="w-full h-48 md:h-64 lg:h-80 object-cover"
      />
    </div>
  );
}
