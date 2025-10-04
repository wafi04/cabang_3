"use client";
import { useGetAllCategory } from "../api";
import Link from "next/link";
import Image from "next/image";

export function SectionCategory() {
  return (
    <section className="flex flex-col  w-full">
      <CardCategory />
    </section>
  );
}

export function CardCategory() {
  const { data } = useGetAllCategory();

  const subcategories = data?.data.data || [];

  return (
    <div className="mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-5">
        {subcategories.map((item) => {
          const url = item.brand.replace(" ", "-").toLocaleLowerCase();
          return (
            <Link
              key={item.id}
              href={`/order/${url}`}
              className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2  relative min-h-80 rounded-lg"
            >
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <Image
                  src={item.thumbnail}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={item.information || item.name || "Category"}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 /95 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold  transition-colors duration-200 line-clamp-1">
                      {item.name}
                    </h3>
                    {item.sub_name && (
                      <p className="text-sm text-accent/80 mt-1 line-clamp-2">
                        {item.sub_name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
