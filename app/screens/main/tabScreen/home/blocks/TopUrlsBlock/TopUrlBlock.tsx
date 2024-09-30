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

type Props = {
  block: AudiotekaTopUrlList;
};

const TopUrlBlock: React.FC<React.PropsWithChildren<Props>> = ({block}) => {
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
      <Text style={styles.title} fontFamily="SourceSansPro-SemiBold">
        {title}
      </Text>
      <Divider style={styles.divider} />
      <View style={styles.container}>{itemsComponents}</View>
    </View>
  );
};

export default TopUrlBlock;

const styles = StyleSheet.create({
  root: {
    margin: 8,
    paddingVertical: 4,
  },
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  divider: {
    width: 40,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 14,
    paddingVertical: 8,
    paddingRight: 16,
  },
});
