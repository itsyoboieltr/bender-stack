const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('@lingui/metro-transformer/expo'),
};
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'po', 'pot'],
};

module.exports = withNativeWind(config, {
  input: './global.css',
  inlineRem: 16,
});
