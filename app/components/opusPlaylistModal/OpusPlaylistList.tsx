import React, {useCallback} from 'react';
import {View, StyleSheet, ListRenderItemInfo} from 'react-native';
import {OpusPlayListItem} from '../../api/Types';
import {useTheme} from '../../Theme';
import Divider from '../divider/Divider';
import MyFlatList from '../MyFlatList/MyFlatList';
import TextComponent from '../text/Text';

interface OpusPaylistListProps {
  items: OpusPlayListItem[];
  currentSong: string;
}

const OpusPaylistList: React.FC<OpusPaylistListProps> = ({items}) => {
  const {colors} = useTheme();

  const keyExtractor = useCallback((item: OpusPlayListItem, index: number) => {
    return `${index}-${item.dt}`;
  }, []);

  const renderItem = useCallback((itemInfo: ListRenderItemInfo<OpusPlayListItem>) => {
    const {item} = itemInfo;
    return (
      <View style={styles.listItem}>
        <TextComponent style={styles.timeText} fontFamily="SourceSansPro-SemiBold">
          {item.dt}
        </TextComponent>
        <TextComponent style={styles.songText}>{item.song}</TextComponent>
      </View>
    );
  }, []);

  const renderReparator = useCallback(() => {
    return <Divider />;
  }, []);

  return (
    <View style={{...styles.container, borderColor: colors.border, backgroundColor: colors.background}}>
      <MyFlatList
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={items}
        renderItem={renderItem}
        extraData={items}
        initialNumToRender={20}
        ItemSeparatorComponent={renderReparator}
        inverted={true}
        windowSize={16}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default OpusPaylistList;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    overflow: 'hidden',
  },
  listItem: {
    padding: 12,
  },
  timeText: {
    color: '#e7792b',
    fontSize: 13,
  },
  songText: {
    marginTop: 2,
    fontSize: 14,
  },
});
