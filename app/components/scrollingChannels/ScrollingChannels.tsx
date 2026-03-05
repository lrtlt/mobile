import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import {TVProgramChannel} from '../../api/Types';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import ChannelV2 from './channel_v2/Channel_v2';
import {useCurrentProgram} from '../../api/hooks/useProgram';

interface Props {
  onChannelPress: (channel: TVProgramChannel) => void;
}

const ScrollingChannels: React.FC<React.PropsWithChildren<Props>> = ({onChannelPress}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const {data} = useCurrentProgram();

  const {colors, strings} = useTheme();

  const onChannelPressHandler = useCallback(
    (channel: TVProgramChannel) => {
      onChannelPress(channel);
    },
    [onChannelPress],
  );

  const onProgramPressHandler = useCallback(() => {
    navigation.navigate('Program');
  }, [navigation]);

  if (!data || data.tvprog?.items.length === 0) {
    return <View />;
  }

  const {items, live_items} = data.tvprog;

  const allChannels = [
    ...(live_items ?? []).map((item) => ({item, isLive: true})),
    ...(items ?? []).map((item) => ({item, isLive: false})),
  ];

  const rows: {item: TVProgramChannel; isLive: boolean}[][] = [];
  for (let i = 0; i < allChannels.length; i += 2) {
    rows.push(allChannels.slice(i, i + 2));
  }

  return (
    <View style={{...styles.container}}>
      <View style={styles.topHeader}>
        <TextComponent style={styles.leftText} fontFamily="SourceSansPro-SemiBold">
          {strings.tvProgramTitle}
        </TextComponent>
        <TouchableDebounce onPress={onProgramPressHandler}>
          <TextComponent style={{...styles.rightText, color: colors.primary}}>
            {strings.tvProgram}
          </TextComponent>
        </TouchableDebounce>
      </View>
      <View style={styles.tilesContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.tilesRow}>
            {row.map(({item, isLive}, i) => (
              <ChannelV2
                data={item}
                key={`${rowIndex}-${i}-${item.proc}`}
                isLive={isLive}
                onPress={onChannelPressHandler}
              />
            ))}
            {row.length === 1 && <View style={styles.tilePlaceholder} pointerEvents="none" />}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ScrollingChannels;

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 2,
    padding: 4,
    paddingBottom: 8,
  },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
  },
  leftText: {
    fontSize: 18,
    textTransform: 'uppercase',
    padding: 8,
  },
  rightText: {
    fontSize: 15,
    textTransform: 'capitalize',
    padding: 8,
    margin: 8,
  },
  tilesContainer: {
    gap: 8,
    margin: 4,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tilePlaceholder: {
    flex: 1,
    flexBasis: 0,
  },
});
