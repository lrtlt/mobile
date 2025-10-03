import {Menu2Item} from '../../../api/Types';
import {StyleSheet} from 'react-native';
import Text from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';

interface Props {
  item: Menu2Item;
  onPress: (item: Menu2Item) => void;
  icon?: React.ReactNode;
}
const DrawerBasicItem: React.FC<Props> = ({item, onPress, icon}) => {
  return (
    <TouchableDebounce style={styles.container} onPress={() => onPress(item)}>
      {icon}
      <Text fontFamily="SourceSansPro-SemiBold" style={styles.text}>
        {item.title}
      </Text>
    </TouchableDebounce>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 52,
    gap: 12,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 15,
  },
});

export default DrawerBasicItem;
