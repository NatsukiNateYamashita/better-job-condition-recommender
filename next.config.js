/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // サーバーサイドでSSL証明書の検証を無効化
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    }
    return config;
  }
};

module.exports = nextConfig;
