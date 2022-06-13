import React, {useEffect} from 'react';
import {LayoutAnimation, Platform, UIManager} from 'react-native';

interface Props {
  collapsed: boolean;
  duration: number;
}

const Collapsible: React.FC<Props> = ({children, collapsed, duration}) => {
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  LayoutAnimation.configureNext(
    LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity),
  );

  return collapsed ? null : <>{children}</>;
};

export default Collapsible;
