/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  
  // Databricks SQL パッケージの依存関係問題を解決
  webpack: (config, { isServer }) => {
    if (isServer) {
      // サーバーサイドでのみDatabricksパッケージを処理
      config.externals = config.externals || [];
      config.externals.push({
        'lz4': 'commonjs lz4'
      });
    }
    
    // Node.js固有のモジュールをクライアントサイドで除外
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };
    
    return config;
  },
  
  // API ルートでのみサーバーサイドパッケージを使用
  experimental: {
    serverComponentsExternalPackages: ['@databricks/sql']
  }
};

module.exports = nextConfig;
