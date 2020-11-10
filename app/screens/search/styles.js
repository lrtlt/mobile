import EStyleSheet from 'react-native-extended-stylesheet';
import {getSmallestDim} from '../../util/UI';

const styles = EStyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '$windowBackground',
  },
  row: {
    flexDirection: 'row',
  },
  article: {
    padding: '$articlePadding',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    paddingBottom: 2,
    paddingTop: 2,
    margin: 4,
    width: getSmallestDim() * 0.5,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15,
    color: '$textColor',
    borderBottomWidth: 0.5,
    borderColor: '$headerTintColor',
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
