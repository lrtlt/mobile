import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '$windowBackground',
  },

  container: {
    flex: 1,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    marginBottom: 20,
    fontSize: 20,
  },
  slugText: {
    color: '$textColor',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 17,
  },
});

export default styles;
