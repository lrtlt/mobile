import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  gallerySwiper: {
    backgroundColor: '$windowBackground',
  },
  absoluteLayout: {
    position: 'absolute',
  },
  backButtonContainer: {
    marginTop: 48,
    marginLeft: 12,
    padding: 6,
    borderRadius: 40,
    backgroundColor: '#FFFFFF20',
  },
  detailsContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 24,
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    opacity: 0.8,
    backgroundColor: '$windowBackground',
  },
  authorText: {
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
    marginTop: 4,
  },
  title: {
    color: '$titleTextColor',
    marginTop: 4,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
  },
});

export default styles;
