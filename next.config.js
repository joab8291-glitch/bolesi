/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.xuansiwei.com' },
      { protocol: 'https', hostname: 'www.joegraham.co.uk' },
      { protocol: 'https', hostname: 's.alicdn.com' },
      { protocol: 'https', hostname: 'image.made-in-china.com' },
    ],
    minimumCacheTTL: 2592000,
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75],
  },
};
