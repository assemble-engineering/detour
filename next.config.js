const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  modules: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: 'url-loader?limit=200000',
        },
      ],
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  redirects() {
    return [
      {
        source: '/a',
        destination: '/',
        permanent: true,
      },
    ]
  }
}
