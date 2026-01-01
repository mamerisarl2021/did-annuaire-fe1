import type { NextConfig } from 'next'

const config: NextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    experimental: { serverActions: { bodySizeLimit: '2mb' } },
    headers: async () => [
        {
            source: '/:_next/static/(.*)',
            headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
    ],
    images:{
    domains: [],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: "DID Annuaire",
    NEXT_PUBLIC_APP_VERSION: "1.0.0",
  },
};

export default config
