/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  //   allowedDevOrigins: ["https://fe.zilog.my.id"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "images.tokopedia.net",
      },
      {
        hostname: "cdn.ourastore.com",
      },
      {
        hostname : "storage.zilog.my.id",
      },
      {
        hostname: "www.ourastore.com",
      },
      {
        hostname: "img.redbull.com",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "client-cdn.bangjeff.com",
      },
      {
        hostname: "vazzuniverse.id",
      },
      {
        hostname: "www.veinstore.id",
      },
      {
        hostname: "semutganteng.fra1.digitaloceanspaces.com",
      },
      {
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
