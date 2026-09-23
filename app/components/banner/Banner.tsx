import React from 'react';
import {StyleSheet, useWindowDimensions, View, ViewStyle} from 'react-native';
import {HomeBlockEmbed} from '../../api/Types';
import {themeLight} from '../../Theme';
import SafeAutoHeightWebView from '../safeWebView/SafeAutoHeightWebView';

interface Props {
  data: HomeBlockEmbed;
  /** Overrides the default container spacing. */
  containerStyle?: ViewStyle;
}

// Banner HTML is written for lrt.lt and leans on its CSS: without it a 900px image overflows
// and section titles fall back to the browser's serif.
const BANNER_STYLE = `
  img { max-width: 100%; height: auto; }
  .section__title {
    margin: 0 0 16px;
    font-family: 'SourceSansPro-SemiBold', 'Source Sans Pro', -apple-system, Roboto, sans-serif;
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
    text-transform: uppercase;
    color: #000000;
  }
`;

const BannerComponent: React.FC<React.PropsWithChildren<Props>> = ({data, containerStyle}) => {
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
          ...containerStyle,
        }}
        cacheEnabled={true}
        startInLoadingState={true}
        viewportContent={`width=${width} user-scalable=no`}
        customStyle={BANNER_STYLE}
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
