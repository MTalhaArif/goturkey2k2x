/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n: {
    locales: ["en", "ar", "tr"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "ui-avatars.com" }],
  },
};

export default nextConfig;
