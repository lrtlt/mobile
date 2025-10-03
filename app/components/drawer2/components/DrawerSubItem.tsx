import {Menu2Item} from '../../../api/Types';
import {StyleSheet} from 'react-native';
import Text from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';

interface Props {
  item: Menu2Item;
  onPress: (item: Menu2Item) => void;
  icon?: React.ReactNode;
}

const DrawerSubItem: React.FC<Props> = ({item, icon, onPress}) => {
  if (item.type === 'expandable' || item.type === 'group') {
    console.warn('DrawerSubItem used for non-basic item', item);
    return null;
  }

  return (
    <TouchableDebounce style={styles.container} onPress={() => onPress(item)}>
      {icon}
      <Text fontFamily="SourceSansPro-Regular" style={styles.text}>
        {item.title}
      </Text>
    </TouchableDebounce>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 38,
    alignItems: 'center',
    paddingLeft: 16 + 32,
    gap: 12,
  },
  text: {
    fontSize: 15,
  },
});

export default DrawerSubItem;
