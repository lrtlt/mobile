![alt text](https://www.lrt.lt/images/logo/logo-lrt.svg?v=238)

# LRT.LT

React Native mobile application for [www.lrt.lt](https://www.lrt.lt/) website.

## How to build project

`Note that you can build iOS app only if your running on macOS.`

Before you start you have to have all required tools installed based on your machine.

You can find all information [here](https://facebook.github.io/react-native/docs/getting-started) under **React Native CLI Quickstart** tab.

Once you have all the tools installed open your IDE (we prefer VSCode) and run one of the scripts below:

### Custom scripts

`yarn run-ios` - build & run iOS application

`yarn run-android` - build & run android application

`yarn clean-build` - cleans node_module folder & re-downloads required dependencies. Also runs `pod install` for iOS

`yarn clean-build-win` - cleans node_module folder & re-downloads required dependencies on Windows. Also runs `./gradlew clean` for Android project

### Helpful scripts

`react-native run-ios --configuration Release` build & run iOS application in release mode.

`react-native run-android --variant=release` build & run android application in release mode.

## Contributing

If you want to make changes or improve this application in any way PR's are welcome!

Make sure to format code according to Prettier config.
