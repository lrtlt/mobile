import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  root: {
    flex: 1,
  },
  contentContainer: {
    //padding: '$contentPadding',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '$listSeparator',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabbar: {
    backgroundColor: '$windowBackground',
  },
  tab: {
    width: 140,
  },
  tabLable: {
    width: '100%',
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 10,
    textTransform: 'uppercase',
    paddingTop: 6,
  },

  indicator: {
    backgroundColor: '$primary',
  },
});

export default styles;
