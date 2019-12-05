# react-native-gemius-plugin

## Getting started

`$ npm install react-native-gemius-plugin --save`

### Mostly automatic installation

`$ react-native link react-native-gemius-plugin`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-gemius-plugin` and add `GemiusPlugin.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libGemiusPlugin.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.reactlibrary.GemiusPluginPackage;` to the imports at the top of the file
  - Add `new GemiusPluginPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-gemius-plugin'
  	project(':react-native-gemius-plugin').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-gemius-plugin/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-gemius-plugin')
  	```


## Usage
```javascript
import GemiusPlugin from 'react-native-gemius-plugin';

// TODO: What to do with the module?
GemiusPlugin;
```
