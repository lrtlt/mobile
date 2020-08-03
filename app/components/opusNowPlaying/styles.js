import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '$programProgressColor',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    flexDirection: 'row',
  },
  iconContainer: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    backgroundColor: '$lightGreyBackground',
    padding: 4,
    paddingStart: 8,
    paddingEnd: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  title: {
    flex: 1,
    padding: 4,
    color: '$textColor',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 13,
  },
});

export default styles;
