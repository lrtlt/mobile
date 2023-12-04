module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/font/'],
  dependencies: {
    'react-native-google-cast': {
      platforms: {
        ios: null, // this will disable autolinking for this package on iOS
      },
    },
  },
};
