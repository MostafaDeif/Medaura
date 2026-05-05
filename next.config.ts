/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: "C:/Users/USER/Desktop/Medaura",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;