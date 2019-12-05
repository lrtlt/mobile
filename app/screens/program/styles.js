import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '$windowBackground',
  },
  flexContainer: {
    flex: 1,
  },
  dayHeader: {
    height: '100%',
    justifyContent: 'center',
  },
  dayListItem: {
    padding: 16,
    justifyContent: 'center',
  },
  dayListSeparator: {
    height: 1,
    backgroundColor: '$listSeparator',
  },
  headerText: {
    color: '$textColor',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
  },
});

export default styles;
