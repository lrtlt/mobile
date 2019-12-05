import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$windowBackground',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '20%',
  },
  loader: {
    position: 'absolute',
    bottom: '20%',
  },
  errorText: {
    color: '$textColorSecondary',
    marginTop: 40,
    fontFamily: 'SourceSansPro-Regular',
    marginBottom: 20,
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 24,
    width: '50%',
  },
});

export default styles;
