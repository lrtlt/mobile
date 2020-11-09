import React from 'react';
import {StatusBar} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {isDarkTheme} from '../../ColorTheme';
import PropTypes from 'prop-types';

const statusBar = (props) => {
  const style = isDarkTheme() ? 'light-content' : 'dark-content';
  return (
    <StatusBar
      translucent={props.transulent ? props.transulent : false}
      barStyle={style}
      backgroundColor={props.backgroundColor ? props.backgroundColor : EStyleSheet.value('$statusBar')}
      hidden={props.hidden ? props.hidden : false}
    />
  );
};

statusBar.propTypes = {
  hidden: PropTypes.bool,
  transulent: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

export default statusBar;
