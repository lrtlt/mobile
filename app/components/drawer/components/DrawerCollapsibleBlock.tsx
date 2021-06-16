import React, {useCallback, useState} from 'react';
import {View, Easing, StyleSheet} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {useTheme} from '../../../Theme';
import {IconCarretDown} from '../../svg';
import TextComponent from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';

interface Props {
  title: string;
}

const DrawerCollapsibleBlock: React.FC<Props> = ({title, children}) => {
  const [collapsed, setCollapsed] = useState(true);

  const {colors} = useTheme();

  const titlePressHandler = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  return (
    <View>
      <TouchableDebounce onPress={titlePressHandler} activeOpacity={0.5}>
        <View style={styles.titleContainer}>
          <TextComponent style={styles.title}>{title}</TextComponent>
          {collapsed && <IconCarretDown size={20} color={colors.textSecondary} />}
        </View>
      </TouchableDebounce>
      <Collapsible
        style={styles.container}
        collapsed={collapsed}
        align="bottom"
        duration={200}
        easing={Easing.exp}>
        {children}
      </Collapsible>
    </View>
  );
};

export default DrawerCollapsibleBlock;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});
