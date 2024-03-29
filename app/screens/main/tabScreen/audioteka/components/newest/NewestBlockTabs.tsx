import React, {useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {AudiotekaNewest, AudiotekaNewestCategory} from '../../../../../../api/Types';
import {MyScrollView, Text, TouchableDebounce} from '../../../../../../components';
import {themeLight} from '../../../../../../Theme';

interface Props {
  data: AudiotekaNewest;
  onCategorySelected: (category: AudiotekaNewestCategory) => void;
}

const NewestBlockTabs: React.FC<React.PropsWithChildren<Props>> = ({data, onCategorySelected}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = useMemo(
    () =>
      data.categories.map((c, i) => (
        <Tab
          key={c.title}
          category={c}
          isSelected={i === selectedIndex}
          onPress={() => {
            setSelectedIndex(i);
            onCategorySelected(c);
          }}
        />
      )),
    [data.categories, onCategorySelected, selectedIndex],
  );

  return (
    <MyScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      horizontal={true}
      showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>{tabs}</View>
    </MyScrollView>
  );
};

export default NewestBlockTabs;

interface TabProps {
  category: AudiotekaNewestCategory;
  isSelected: boolean;
  onPress: () => void;
}
const Tab: React.FC<TabProps> = ({category, isSelected, onPress}) => {
  return (
    <TouchableDebounce debounceTime={500} onPress={onPress}>
      <View
        style={{
          ...styles.tabContainer,
          backgroundColor: isSelected ? category['background-color-active'] : category['background-color'],
        }}>
        <Text
          numberOfLines={1}
          style={{
            ...styles.tabText,
            color: isSelected ? themeLight.colors.onPrimary : themeLight.colors.text,
          }}>
          {category.title}
        </Text>
      </View>
    </TouchableDebounce>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    minWidth: '100%',
  },
  scrollViewContent: {
    padding: 8,
  },
  container: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  tabText: {
    textTransform: 'uppercase',

    fontSize: 14,
  },
});
