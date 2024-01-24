import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {ProgramItemType} from '../../../api/Types';
import {ProgramItem} from '../../../components';
import Divider from '../../../components/divider/Divider';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import {PROGRAM_ITEM_HEIGHT} from '../../../components/programItem/ProgramItem';

interface Props {
  items: ProgramItemType[];
  scrollToIndex: number;
}

const ProgramList: React.FC<React.PropsWithChildren<Props>> = ({items, scrollToIndex}) => {
  const ref = useRef<FlashList<any>>(null);

  useEffect(() => {
    ref.current?.scrollToIndex({
      animated: true,
      index: scrollToIndex,
    });
  }, [scrollToIndex]);

  const renderProgramItem = useCallback((val: ListRenderItemInfo<ProgramItemType>) => {
    const item = val.item;
    return (
      <View key={`${item.time_start}-${item.title}`}>
        <ProgramItem
          title={item.title}
          startTime={item.time_start}
          percent={item.proc}
          record_article_id={item.record_article_id}
          description={item.description}
        />
        <Divider style={styles.programItemDivider} />
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: any, i: number) => String(i) + String(item), []);

  return (
    <View style={styles.root}>
      <FlashList
        ref={ref}
        showsVerticalScrollIndicator={false}
        data={items}
        renderItem={renderProgramItem}
        initialScrollIndex={scrollToIndex}
        estimatedItemSize={PROGRAM_ITEM_HEIGHT}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default ProgramList;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    minHeight: '100%',
  },
  programItemDivider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
