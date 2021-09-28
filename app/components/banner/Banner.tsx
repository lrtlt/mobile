import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {HomeBannerBlock} from '../../api/Types';
import SafeAutoHeightWebView from '../safeWebView/SafeAutoHeightWebView';

interface Props {
  data: HomeBannerBlock;
}

const BannerComponent: React.FC<Props> = ({data}) => {
  const width = useWindowDimensions().width - 8 * 2;
  if (!data.html_embed) {
    return null;
  }

  return (
    <View style={{...styles.root}}>
      <SafeAutoHeightWebView
        scrollEnabled={false}
        style={{width}}
        containerStyle={{
          ...styles.container,
        }}
        cacheEnabled={true}
        startInLoadingState={true}
        viewportContent={`width=${width} user-scalable=no`}
        source={{html: data.html_embed}}
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
