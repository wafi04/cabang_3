"use client";

import { UseCreateBanner, UseDeleteBanner, UseGetBannersByBranchId } from "@/features/modules/banner/api";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, EyeOff, GripVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ImageUpload } from "@/features/modules/upload/ImageUpload";

export default function Banner() {
  const { data, isLoading } = UseGetBannersByBranchId();
  const [selectedBanner, setSelectedBanner] = useState<number | null>(null);
  const { mutate: deleteMutate } = UseDeleteBanner();
  const { mutate: createMutate, isPending: isCreating } = UseCreateBanner();
  const [currentUrl]  = useState("")
  const banners = data?.data?.sort((a, b) => a.sortOrder - b.sortOrder) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus banner ini?")) {
      deleteMutate(id);
    }
  };

  // Dipanggil setelah ImageUpload berhasil upload dan dapat URL
  const handleUrlChange = (url: string) => {
    if (!url) return;

    createMutate(url);
  };

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Banner Management</h2>
          <p className="text-sm text-muted-foreground">
            Kelola banner yang ditampilkan di halaman utama
          </p>
        </div>
      </div>
      {/* Banner List */}
      <div className="space-y-3">
        {banners.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-card">
            <p className="text-muted-foreground mb-4">Belum ada banner</p>
            <Button 
              variant="outline" 
              className="gap-2"
              disabled={isCreating}
              asChild
            >
              <label>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Tambah Banner Pertama
                  </>
                )}
                <ImageUpload 
                  onUrlChange={handleUrlChange}
            currentUrl={currentUrl} 
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className={`group flex items-center gap-4 p-4 rounded-lg border transition-all ${
                selectedBanner === banner.id
                  ? "border-primary bg-primary/5"
                  : "bg-card hover:border-primary/50"
              }`}
              onClick={() => setSelectedBanner(banner.id)}
            >
              {/* Drag Handle */}
              <button 
                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <GripVertical className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Sort Order */}
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted text-sm font-medium">
                {banner.sortOrder}
              </div>

              {/* Banner Preview */}
              <div className="relative w-32 h-20 rounded-md overflow-hidden border flex-shrink-0 bg-muted">
                {banner.urlBanner ? (
                  <Image
                    src={banner.urlBanner}
                    alt={`Banner ${banner.id}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Banner Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {banner.isActive ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-500 font-medium">
                      Aktif
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground font-medium">
                      Nonaktif
                    </span>
                  )}
                </div>
               
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title={banner.isActive ? "Nonaktifkan" : "Aktifkan"}
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement toggle active
                  }}
                >
                  {banner.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(banner.id);
                  }}
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add More Banner Button - Bottom */}
      {banners.length > 0 && (
        <div className="flex justify-center pt-4">
          <ImageUpload 
            onUrlChange={handleUrlChange}
            currentUrl={currentUrl} 
           
          />
        </div>
      )}
    </main>
  );
}