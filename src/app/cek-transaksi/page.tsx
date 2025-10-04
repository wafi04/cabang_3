import CheckTransaction from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Status Transaksi",
  description:
    "Cek status transaksi Anda dengan mudah. Masukkan nomor invoice untuk melihat detail pembayaran dan status pesanan Anda.",
  keywords: [
    "cek transaksi",
    "status pembayaran",
    "lacak pesanan",
    "invoice",
    "status order",
  ],
  openGraph: {
    title: "Cek Status Transaksi",
    description:
      "Cek status transaksi Anda dengan mudah. Masukkan nomor invoice untuk melihat detail pembayaran dan status pesanan Anda.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cek Status Transaksi",
    description:
      "Cek status transaksi Anda dengan mudah. Masukkan nomor invoice untuk melihat detail pembayaran dan status pesanan Anda.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <CheckTransaction />;
}
