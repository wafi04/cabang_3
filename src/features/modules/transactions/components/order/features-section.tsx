"use client"
import { Zap, Shield, DollarSign, Gift, Trophy, Headphones } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Proses Instan",
      description: "Top up diproses dalam hitungan detik, tanpa perlu menunggu lama.",
      gradient: "from-yellow-500 to-orange-500",
      delay: "0",
    },
    {
      icon: Shield,
      title: "100% Aman",
      description: "Data dan transaksi kamu terenkripsi serta terlindungi sepenuhnya.",
      gradient: "from-blue-500 to-cyan-500",
      delay: "100",
    },
    {
      icon: DollarSign,
      title: "Harga Termurah",
      description: "Harga bersaing dengan banyak pilihan metode pembayaran.",
      gradient: "from-green-500 to-emerald-500",
      delay: "200",
    },
    {
      icon: Gift,
      title: "Bonus Harian",
      description: "Dapatkan promo, cashback, dan hadiah setiap hari.",
      gradient: "from-pink-500 to-rose-500",
      delay: "300",
    },
    {
      icon: Trophy,
      title: "Resmi & Terpercaya",
      description: "Kami adalah reseller resmi untuk semua game populer.",
      gradient: "from-purple-500 to-violet-500",
      delay: "400",
    },
    {
      icon: Headphones,
      title: "Support 24/7",
      description: "Tim CS siap membantu kamu kapan saja, tanpa henti.",
      gradient: "from-amber-500 to-yellow-500",
      delay: "500",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-background to-background/50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
            <span className="mr-2">✨</span>
            Keunggulan Kami
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Kenapa Pilih Kami?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Layanan cepat, aman, dan terpercaya untuk semua kebutuhan top up game kamu
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${parseInt(feature.delay)}ms both`
                }}
              >
                {/* Card */}
                <div className="relative h-full p-8 rounded-2xl bg-card border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300" />
                  
                  {/* Icon container with gradient */}
                  <div className="relative mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <div className="flex items-center justify-center w-full h-full rounded-2xl bg-background/95">
                        <Icon className={`w-7 h-7 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`} strokeWidth={2.5} />
                      </div>
                    </div>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
                  </div>

                  {/* Content */}
                  <div className="relative space-y-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Animated corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br ${feature.gradient}`} />
                    <div className={`absolute top-6 right-6 w-1 h-1 rounded-full bg-gradient-to-br ${feature.gradient} animate-ping`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="group relative inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-full bg-primary text-primary-foreground overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105">
            <span className="relative z-10">Mulai Top Up Sekarang</span>
            <svg className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}