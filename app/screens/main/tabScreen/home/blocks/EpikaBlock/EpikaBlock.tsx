import {useCallback} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {HomeBlockEpikaBlock} from '../../../../../../api/Types';
import FastImage from '@d11/react-native-fast-image';
import {MediaIndicator, Text, TouchableDebounce} from '../../../../../../components';
import {themeLight, useTheme} from '../../../../../../Theme';
import {IconLRTEpika} from '../../../../../../components/svg';

interface EpikaBlockProps {
  block: HomeBlockEpikaBlock;
}

const listGapSize = 12;

const EpikaBlock: React.FC<EpikaBlockProps> = ({block}) => {
  const {data} = block;
  const {background_image, cta_title, cta_url, list} = data;

  const {colors} = useTheme();

  const openUrl = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  const renderListItem = useCallback((item: (typeof data.list)[0]) => {
    return (
      <View key={item.image} style={{flex: 1, aspectRatio: 136 / 76.5}}>
        <TouchableDebounce
          style={{...styles.fill, justifyContent: 'center'}}
          onPress={() => {
            openUrl(item.href);
          }}>
          <FastImage
            style={styles.fill}
            source={{
              uri: item.image,
            }}
            resizeMode="stretch"
          />
          <MediaIndicator style={styles.mediaIndicator} size="small" />
        </TouchableDebounce>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.fill}
        resizeMode="cover"
        source={{
          uri: background_image,
        }}
      />
      <IconLRTEpika width={130} height={55} />
      <Text>
        <Text style={styles.titleText}>{'LRT Epika -\nfilmai ir serialai'}</Text>
        <Text style={{...styles.titleText, color: colors.epikaGreen}}>{'\nnemokamai'}</Text>
      </Text>

      <TouchableDebounce onPress={() => openUrl(cta_url)}>
        <View style={{...styles.cta, backgroundColor: colors.epikaGreen}}>
          <Text style={{...styles.ctaText, color: themeLight.colors.text}}>{cta_title.toUpperCase()}</Text>
        </View>
      </TouchableDebounce>

      <View style={{gap: listGapSize}}>
        {list.length >= 2 ? (
          <View style={{flexDirection: 'row', gap: listGapSize}}>
            {renderListItem(list[0])}
            {renderListItem(list[1])}
          </View>
        ) : null}
        {list.length >= 4 ? (
          <View style={{flexDirection: 'row', gap: listGapSize}}>
            {renderListItem(list[2])}
            {renderListItem(list[3])}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default EpikaBlock;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 40,
    width: '100%',
    aspectRatio: 300 / 520,
    justifyContent: 'space-between',
  },
  ctaText: {
    fontSize: 16,
  },
  titleText: {
    fontSize: 38,
    color: 'white',
    lineHeight: 38,
  },
  cta: {
    alignSelf: 'baseline',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  mediaIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  fill: StyleSheet.absoluteFill,
});
