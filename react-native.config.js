module.exports = {
  project: {
    ios: {
      // Skip the automatic pod install on `run-ios`. Run `pod install` manually
      // after dependency changes, or use `run-ios --force-pods`.
      automaticPodsInstallation: false,
    },
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
