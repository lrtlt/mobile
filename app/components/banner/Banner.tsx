import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {HomeBlockEmbed} from '../../api/Types';
import {themeLight} from '../../Theme';
import SafeAutoHeightWebView from '../safeWebView/SafeAutoHeightWebView';

interface Props {
  data: HomeBlockEmbed;
}

const BannerComponent: React.FC<React.PropsWithChildren<Props>> = ({data}) => {
  const width = useWindowDimensions().width - 8 * 2;
  if (!data.html) {
    return null;
  }

  return (
    <View style={{...styles.root}}>
      <SafeAutoHeightWebView
        scrollEnabled={false}
        style={{width}}
        containerStyle={{
          ...styles.container,
          backgroundColor: themeLight.colors.background,
        }}
        cacheEnabled={true}
        startInLoadingState={true}
        viewportContent={`width=${width} user-scalable=no`}
        source={{html: data.html}}
        openLinksExternally={true}
      />
    </View>
  );
};

export default React.memo(BannerComponent);

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  container: {
    marginVertical: 12,
    alignItems: 'center',
  },
});
