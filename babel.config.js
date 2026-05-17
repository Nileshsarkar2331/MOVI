module.exports = function babelConfig(api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@providers': './src/providers',
            '@navigation': './src/navigation',
            '@assets': './src/assets',
            '@components': './src/components',
            '@config': './src/config',
            '@features': './src/features',
            '@services': './src/services',
            '@store': './src/store',
            '@theme': './src/theme',
            '@types': './src/types',
            '@utils': './src/utils'
          }
        }
      ],
      // react-native-reanimated/plugin MUST be last
      'react-native-reanimated/plugin'
    ]
  };
};