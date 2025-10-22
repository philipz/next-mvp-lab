const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const resolveProxyTarget = () => {
  const rawTarget =
    process.env.NEXT_API_PROXY_TARGET ?? process.env.NEXT_PUBLIC_API_URL ?? '';

  if (ABSOLUTE_URL_REGEX.test(rawTarget)) {
    return rawTarget;
  }

  const normalized = rawTarget.trim();
  if (normalized && normalized !== '/' && normalized !== '/api') {
    // If a non-empty relative target is provided, use it as-is.
    return normalized;
  }

  // Fall back to sensible defaults for local dev vs containerized deployment.
  return process.env.NODE_ENV === 'production' ? 'http://monolith:8080' : 'http://localhost:8080';
};

const API_PROXY_TARGET = resolveProxyTarget();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.gr-assets.com',
      },
    ],
  },
  async rewrites() {
    if (!ABSOLUTE_URL_REGEX.test(API_PROXY_TARGET)) {
      return [];
    }

    const sanitizedTarget = API_PROXY_TARGET.endsWith('/')
      ? API_PROXY_TARGET.slice(0, -1)
      : API_PROXY_TARGET;

    return [
      {
        source: '/api/:path*',
        destination: `${sanitizedTarget}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
