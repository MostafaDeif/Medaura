/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: "C:/Users/USER/Desktop/Medaura",
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },
};

export default nextConfig;