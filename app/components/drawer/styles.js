import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$appBarBackground',
  },
  scroll: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  title: {
    color: '$textColor',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: '$drawerTitleTextSize',
    padding: '$drawerPadding*2',
    fontWeight: 'bold',
  },
  channelContainer: {
    paddingBottom: '$drawerPadding',
  },
  headerContainer: {
    paddingTop: '$drawerPadding',
    paddingBottom: '$drawerPadding',
  },
  footerContainer: {
    paddingBottom: '$drawerPadding',
  },
  line: {
    height: 1,
    marginStart: '$drawerPadding*2',
    marginEnd: '$drawerPadding*2',
    //marginBottom: '$drawerPadding',
    backgroundColor: '$listSeparator',
  },
});
