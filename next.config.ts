import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // السطر ده بيقول لـ Next.js: ماتجيش جنب المكتبات دي وسيبها تشتغل على السيرفر براحتها
  serverExternalPackages: ["mjml"],
};

export default nextConfig;