import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  tabbar: {
    backgroundColor: '$windowBackground',
    shadowRadius: 1,
  },
  tab: {
    width: 'auto',
    paddingLeft: 16,
    paddingRight: 16,
  },
  indicator: {
    backgroundColor: '$primaryDark',
  },
});
