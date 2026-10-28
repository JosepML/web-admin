/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=*, autoplay=*, clipboard-write=*, encrypted-media=*, gyroscope=*, picture-in-picture=*, web-share=*',
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig