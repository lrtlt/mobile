import {Linking, StyleSheet, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {AudiotekaTopUrlList} from '../../../../../../api/Types';
import {Text, TouchableDebounce} from '../../../../../../components';
import {useTheme} from '../../../../../../Theme';
import Divider from '../../../../../../components/divider/Divider';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {useNavigationStore} from '../../../../../../state/navigation_store';
import {ScrollView} from 'react-native-gesture-handler';

type Props = {
  block: AudiotekaTopUrlList;
};

const TopUrlInlineBlock: React.FC<React.PropsWithChildren<Props>> = ({block}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const {colors} = useTheme();

  const {title, items} = block.url_list;

  const onPressHandler = useCallback(
    async (item: (typeof items)[number]) => {
      switch (item.url_type) {
        case 'tag': {
          navigation.navigate('Slug', {
            name: item.title,
            slugUrl: item.tag_slug,
          });
          break;
        }
        case 'category': {
          useNavigationStore.getState().openCategoryById(item.category_id, item.title);
          break;
        }
        case 'webpage': {
          try {
            Linking.openURL(item.url);
          } catch (e) {
            console.warn(e);
          }
          break;
        }
        default: {
          console.warn('Unkown url type: ', JSON.stringify(item, null, 4));
          break;
        }
      }
    },
    [navigation],
  );

  const itemsComponents = useMemo(
    () =>
      items.map((item) => {
        return (
          <TouchableDebounce key={item.title} onPress={() => onPressHandler(item)}>
            <Text style={{...styles.itemName, color: colors.primaryDark}}>#{item.title}</Text>
          </TouchableDebounce>
        );
      }),
    [colors.primaryDark, items, onPressHandler],
  );

  return (
    <View style={styles.root}>
      <Divider style={styles.divider} />
      <ScrollView horizontal contentContainerStyle={{paddingHorizontal: 8}}>
        <View style={styles.container}>{itemsComponents}</View>
      </ScrollView>
      <Divider style={styles.divider} />
    </View>
  );
};

export default TopUrlInlineBlock;

const styles = StyleSheet.create({
  root: {
    paddingVertical: 4,
  },
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  divider: {
    flex: 1,
  },

  itemName: {
    fontSize: 14,
    paddingVertical: 12,
    paddingRight: 16,
  },
});
