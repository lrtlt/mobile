import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {ProgramItemType} from '../../../api/Types';
import {MyFlatList, ProgramItem} from '../../../components';
import Divider from '../../../components/divider/Divider';
import {PROGRAM_ITEM_HEIGHT} from '../../../components/programItem/ProgramItem';

interface Props {
  items: ProgramItemType[];
  scrollToIndex: number;
}

const ProgramList: React.FC<Props> = ({items, scrollToIndex}) => {
  const ref = useRef<MyFlatList>(null);

  useEffect(() => {
    ref.current?.scrollToIndex({
      animated: false,
      index: scrollToIndex,
    });
  }, [scrollToIndex]);

  const renderProgramItem = useCallback((val) => {
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

  const calculateProgramItemLayout = useCallback(
    (_, index) => ({length: PROGRAM_ITEM_HEIGHT, offset: PROGRAM_ITEM_HEIGHT * index, index}),
    [],
  );

  const keyExtractor = useCallback((item, i) => String(i) + String(item), []);

  return (
    <MyFlatList
      style={styles.root}
      shouldActivateOnStart
      ref={ref}
      showsVerticalScrollIndicator={false}
      data={items}
      renderItem={renderProgramItem}
      getItemLayout={calculateProgramItemLayout}
      initialScrollIndex={scrollToIndex}
      contentContainerStyle={styles.scrollContainer}
      windowSize={21}
      initialNumToRender={50}
      keyExtractor={keyExtractor}
    />
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
