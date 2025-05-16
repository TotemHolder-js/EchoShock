/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'your-supabase-project.supabase.co'],
  },
<<<<<<< HEAD
  webpack(config) {
    // 1) Exclude .svg from Next.js default asset loader
    config.module.rules.forEach((rule) => {
      if (
        rule.test instanceof RegExp &&
        rule.test.source.includes('svg')
      ) {
        rule.exclude = /\.svg$/;
      }
    });

    // 2) Add SVGR loader
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,    // auto width/height="1em"
            svgo: true,    // enable SVGO
            svgoConfig: {
              plugins: [
                // disable the default removeViewBox plugin so viewBox is preserved
                { name: 'removeViewBox', active: false }
              ]
            },
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
=======
}

module.exports = nextConfig
>>>>>>> e5065aeb381b6f0ea917433b9891e6d8611fd14c
