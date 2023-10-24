/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL || "",
  },
};

module.exports = nextConfig;
