"use client";
import { AuthenticationLayout } from "@/features/layouts/authenticationLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Receipt, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CheckTransaction() {
  const [invoiceId, setInvoiceId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceId.trim()) {
      toast.error("Masukkan nomor invoice!");
      return;
    }

    setIsSearching(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    router.push(`/invoice/${invoiceId.trim()}`);
  };

  return (
    <AuthenticationLayout>
      <div className="container mx-auto px-4 pb-24 min-h-[calc(100vh-300px)] flex items-center justify-center">
        <div className="w-full max-w-lg space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
           
            <h1 className="text-3xl font-bold">Cek Status Transaksi</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Lacak dan pantau status transaksi kamu dengan nomor invoice
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label 
                  htmlFor="invoiceId" 
                  className="text-sm font-medium text-foreground"
                >
                  Nomor Invoice
                </label>
                <div className="relative">
                  <Input
                    id="invoiceId"
                    type="text"
                    placeholder="RS123456789"
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    disabled={isSearching}
                    className="h-12 pl-4 pr-12 text-center font-mono text-base rounded-xl border-border focus:border-primary transition-all"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSearching}
                className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all group"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Mencari...
                  </>
                ) : (
                  <>
                    Cek Transaksi
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>

         
        </div>
      </div>
    </AuthenticationLayout>
  );
}