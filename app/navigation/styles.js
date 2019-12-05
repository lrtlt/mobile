import EStyleSheet from 'react-native-extended-stylesheet';
import { getSmallestDim } from '../util/UI';

const styles = EStyleSheet.create({
  row: {
    flexDirection: 'row',
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
});

export default styles;
