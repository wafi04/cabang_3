"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useGetInvoice } from "./api";
import { Steps } from "./steps";
import { FormatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Copy, Download, ExternalLink } from "lucide-react";
import { AuthenticationLayout } from "@/features/layouts/authenticationLayout";

export default function InvoicePage() {
  const { slug } = useParams();
  const invoiceId = slug;
  const { data, isLoading, error } = useGetInvoice(invoiceId as string);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const invoice = data?.data;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const downloadQR = (qrData: string) => {
    const link = document.createElement("a");
    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
      qrData
    )}`;
    link.download = "qris.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "success":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
      case "expired":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <Suspense fallback={<>...</>}>
        <AuthenticationLayout>
          <main className="container my-10 flex w-full flex-col items-center px-4">
            <div className="animate-pulse space-y-4 w-full max-w-4xl">
              <div className="h-4 bg-muted rounded w-48"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
            </div>
          </main>
        </AuthenticationLayout>
      </Suspense>
    );
  }

  if (error || !invoice) {
    return (
      <Suspense fallback={<>...</>}>
        <AuthenticationLayout>
          <main className="container my-10 flex w-full flex-col items-center px-4">
            <Card className="max-w-md">
              <CardContent className="pt-6 text-center space-y-2">
                <p className="text-destructive text-lg font-medium">
                  Gagal memuat invoice.
                </p>
                <p className="text-muted-foreground text-sm">
                  {error?.message || "Invoice tidak ditemukan"}
                </p>
              </CardContent>
            </Card>
          </main>
        </AuthenticationLayout>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<>...</>}>
      <AuthenticationLayout>
        <main className="container px-4 mt-20 mb-10 min-h-screen">
          <Steps status={invoice.status} />

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Product & Payment Details */}
            <div className="space-y-6">
              {/* Product Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Produk</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product Name</span>
                    <span className="font-medium text-right">
                      {invoice.product_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tujuan</span>
                    <span className="font-medium text-right">
                      {invoice.tujuan}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ref ID</span>
                    <span className="font-medium text-right">
                      {invoice.reference_id}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details Accordion */}
              <Card>
                <CardContent className="p-0">
                  <button
                    onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                    className="flex w-full items-center justify-between px-6 py-4 text-sm font-medium hover:bg-accent transition-colors"
                    type="button"
                  >
                    <span>Rincian Pembayaran</span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        showPaymentDetails ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showPaymentDetails && (
                    <div className="border-t px-6 py-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Harga</span>
                        <span className="text-muted-foreground">
                          {FormatCurrency(invoice.price)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span className="text-muted-foreground">
                          {FormatCurrency(invoice.price)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Biaya</span>
                        <span className="text-muted-foreground">
                          {FormatCurrency(invoice.fee)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Total */}
              <Card className="border-primary">
                <CardContent className="flex justify-between items-center py-4">
                  <div className="font-bold text-lg">Total Pembayaran</div>
                  <div className="font-bold text-primary text-xl">
                    {FormatCurrency(invoice.total)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Payment Method */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Payment Method
                    </p>
                    <p className="font-semibold text-lg">
                      {invoice.payment_type}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">
                        Nomor Invoice
                      </p>
                      <p className="font-semibold break-all">
                        {invoice.reference_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Status</p>
                      <Badge variant={getStatusVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Virtual Account */}
                  {invoice.payment_type === "virtual-account" &&
                    invoice.payment_payload && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">
                          Nomor Virtual Account:
                        </p>
                        <div className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-3">
                          <code className="font-mono text-lg font-semibold flex-1">
                            {invoice.payment_payload}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyToClipboard(invoice.payment_payload || "")
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                  {/* QRIS / QR Code */}
                  {(invoice.payment_type === "qris" ||
                    invoice.payment_type === "qrcode") &&
                    invoice.payment_payload && (
                      <div className="space-y-4">
                        <p className="text-sm font-medium">Scan QR Code:</p>
                        <div className="flex flex-col items-center space-y-4">
                          <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-lg border bg-background">
                            <Image
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                                invoice.payment_payload
                              )}`}
                              width={500}
                              height={500}
                              alt="QR Code"
                              className="w-60 h-60 object-contain"
                              loading="lazy"
                            />
                          </div>
                          <Button
                            onClick={() =>
                              downloadQR(invoice.payment_payload as string)
                            }
                            className="w-full max-w-64"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Unduh Kode QR
                          </Button>
                        </div>
                      </div>
                    )}

                  {/* E-Wallet */}
                  {invoice.payment_type === "e-wallet" &&
                    invoice.payment_payload && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">
                          Bayar dengan E-Wallet:
                        </p>
                        <Button asChild className="w-full">
                          <Link
                            href={invoice.payment_payload}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Buka E-Wallet
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </AuthenticationLayout>
    </Suspense>
  );
}
