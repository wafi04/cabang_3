import { AuthenticationLayout } from "@/features/layouts/authenticationLayout";
import { Metadata } from "next";
import { LeaderboardTransaksi } from "./Leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard Transaksi | Top Reseller & Customer",
  description:
    "Lihat ranking top reseller dan customer dengan transaksi terbanyak. Kompetisi bulanan dengan reward menarik untuk top performer.",
  keywords: [
    "leaderboard",
    "top reseller",
    "top customer",
    "ranking transaksi",
    "kompetisi reseller",
    "reward reseller",
  ],
  openGraph: {
    title: "Leaderboard Transaksi | Top Reseller & Customer",
    description:
      "Lihat ranking top reseller dan customer dengan transaksi terbanyak. Kompetisi bulanan dengan reward menarik untuk top performer.",
    type: "website",
    images: [
      {
        url: "https://gamipress.com/wp-content/uploads/2018/12/leaderboards.svg",
        width: 1200,
        height: 630,
        alt: "Leaderboard Transaksi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leaderboard Transaksi | Top Reseller & Customer",
    description:
      "Lihat ranking top reseller dan customer dengan transaksi terbanyak. Kompetisi bulanan dengan reward menarik untuk top performer.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return (
    <AuthenticationLayout className="w-full h-full min-h-screen max-w-full p-0">
      <LeaderboardTransaksi />
    </AuthenticationLayout>
  );
}
