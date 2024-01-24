import React, {useEffect} from 'react';
import {useRef} from 'react';
import {LayoutAnimation, Platform, UIManager} from 'react-native';

interface Props {
  collapsed: boolean;
  duration: number;
}

const Collapsible: React.FC<React.PropsWithChildren<Props>> = ({children, collapsed, duration}) => {
  const isCollapsed = useRef(collapsed);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  if (isCollapsed.current !== collapsed) {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        duration,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
    isCollapsed.current = collapsed;
  }

  return collapsed ? null : <>{children}</>;
};

export default Collapsible;
