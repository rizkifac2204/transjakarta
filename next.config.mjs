/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              // default
              "default-src 'self'",

              // gambar (Google profile, Maps tiles, UserWay icon)
              "img-src 'self' blob: data: https://lh3.googleusercontent.com https://lh4.googleusercontent.com https://lh5.googleusercontent.com https://lh6.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com https://cdn.userway.org",

              // script (Google, Maps, UserWay, jsDelivr, Google Login)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://accounts.google.com https://maps.googleapis.com https://cdn.userway.org https://cdn.jsdelivr.net",

              // style (Google Fonts, UserWay, jsDelivr, Google Login)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.userway.org https://cdn.jsdelivr.net https://accounts.google.com",

              // fonts (Google Fonts, UserWay font/icon)
              "font-src 'self' https://fonts.gstatic.com https://cdn.userway.org",

              // koneksi ke API eksternal
              "connect-src 'self' https://www.google.com https://www.gstatic.com https://accounts.google.com https://maps.googleapis.com https://cdn.userway.org https://api.userway.org https://api.iconify.design https://api.unisvg.com https://api.simplesvg.com",

              // frame (Google reCAPTCHA, Maps embed, Google Login)
              "frame-src 'self' blob: https://www.google.com https://accounts.google.com https://cdn.userway.org https://userway.org",

              // tambahan biar tidak kena fallback warning
              "form-action 'self'",
              "object-src 'none'",
              "media-src 'self' blob: data:",
              "child-src 'self' https://cdn.userway.org https://userway.org",

              // anti clickjacking
              "frame-ancestors 'self'",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), camera=(), microphone=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
