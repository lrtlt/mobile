import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    padding: '$articlePadding * 2',
  },

  title: {
    color: '$titleTextColor',
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: '$titleTextSizeSmall',
  },
  timeText: {
    color: '$categoryTitleTextColor',
    fontFamily: 'SourceSansPro-SemiBold',
    marginTop: 2,
    fontSize: '$categoryTextSize',
  },
});

export default styles;
