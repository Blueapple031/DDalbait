const { withTamagui } = require('@tamagui/next-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizePackageImports: ['@tamagui/core'],
  },
  transpilePackages: [
    'react-native',
    'react-native-web',
    '@tamagui/core',
    '@tamagui/animations-css',
    '@tamagui/config',
    '@tamagui/font-inter',
    '@tamagui/theme-base',
    '@tamagui/themes',
    'tamagui',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },
};

module.exports = withTamagui({
  config: './tamagui.config.ts',
  components: ['tamagui'],
  outputCSS: './app/tamagui.css',
})(nextConfig); 