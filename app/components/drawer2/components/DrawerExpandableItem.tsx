import {Menu2Item} from '../../../api/Types';
import {StyleSheet, View} from 'react-native';
import Text from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import {IconChevronLeft} from '../../svg';
import {useTheme} from '../../../Theme';
import {useCallback, useState} from 'react';
import DrawerSubItem from './DrawerSubItem';
import Divider from '../../divider/Divider';
import useOnDrawerClose from '../../drawer/useOnDrawerClose';

interface Props {
  item: Menu2Item;
  onPress: (item: Menu2Item) => void;
  alwaysExpanded?: boolean;
}
const DrawerExpandableItem: React.FC<Props> = ({item, onPress, alwaysExpanded = false}) => {
  const [isExpanded, setIsExpanded] = useState(alwaysExpanded);

  if (item.type !== 'expandable' && item.type !== 'group') {
    console.warn('DrawerExpandableItem used for non-expandable item', item);
    return null;
  }
  const {colors} = useTheme();

  useOnDrawerClose(
    useCallback(() => {
      if (alwaysExpanded) return;
      // setIsExpanded(false);
    }, []),
  );

  return (
    <View>
      {isExpanded && <Divider style={styles.dividerTop} />}
      <TouchableDebounce
        style={styles.container}
        activeOpacity={alwaysExpanded ? 1 : 0.7}
        onPress={() => (!alwaysExpanded ? setIsExpanded(!isExpanded) : null)}>
        <Text
          fontFamily="SourceSansPro-SemiBold"
          style={{...styles.text, color: isExpanded ? '#97A2B6' : colors.text}}>
          {item.title}
        </Text>
        {!alwaysExpanded && (
          <IconChevronLeft
            size={16}
            color={colors.text}
            style={{transform: [{rotate: isExpanded ? '270deg' : '90deg'}]}}
          />
        )}
      </TouchableDebounce>
      {isExpanded &&
        item.items?.map((subItem) => <DrawerSubItem key={subItem.title} item={subItem} onPress={onPress} />)}
      {isExpanded && <Divider style={{marginTop: 16}} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  dividerTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  text: {
    fontSize: 15,
  },
});

export default DrawerExpandableItem;
