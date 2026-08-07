module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required plugin for Expo Router
      'expo-router/babel',
      // MUST be listed last for the Drawer navigation animations to work properly
      'react-native-reanimated/plugin',
    ],
  };
};