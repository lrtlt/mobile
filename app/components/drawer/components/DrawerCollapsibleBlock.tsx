import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../../Theme';
import Collapsible from '../../collapsible/Collapsible';
import {IconCarretDown} from '../../svg';
import TextComponent from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import useOnDrawerClose from '../useOnDrawerClose';

interface Props {
  title: string;
}

const DrawerCollapsibleBlock: React.FC<React.PropsWithChildren<Props>> = ({title, children}) => {
  const [collapsed, setCollapsed] = useState(true);

  const {colors, dim} = useTheme();

  useOnDrawerClose(
    useCallback(() => {
      setCollapsed(true);
    }, []),
  );

  const titlePressHandler = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  return (
    <View>
      <TouchableDebounce onPress={titlePressHandler} activeOpacity={0.5}>
        <View
          style={{
            ...styles.titleContainer,
            paddingHorizontal: dim.drawerPadding * 2,
            paddingVertical: dim.drawerPadding * 2,
          }}>
          <TextComponent style={styles.title}>{title}</TextComponent>
          {collapsed && <IconCarretDown size={20} color={colors.textSecondary} />}
        </View>
      </TouchableDebounce>
      <Collapsible collapsed={collapsed} duration={200}>
        {children}
      </Collapsible>
    </View>
  );
};

export default DrawerCollapsibleBlock;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,

    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});
