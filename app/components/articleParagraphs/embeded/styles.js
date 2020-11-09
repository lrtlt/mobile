import EStyleSheet from 'react-native-extended-stylesheet';
import {getSmallestDim} from '../../../util/UI';

export default EStyleSheet.create({
  container: {
    width: '100%',
    paddingTop: '$paragraphSpacing',
    paddingBottom: '$paragraphSpacing',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '$primary',
  },
  articleTitle: {
    color: '$textColor',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 18,
    marginTop: 24,
    marginBottom: 8,
  },
  embededArticleContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  embededPhotoContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  embededHtmlContainer: {
    width: '100%',
    overflow: 'hidden',
    opacity: 0.99,
  },
  embededVideoContainer: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  embededAudioContainer: {
    backgroundColor: 'black',
    aspectRatio: 16 / 9,
  },
  embededArticleText: {
    color: '$textColorSecondary',
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 18,
  },
  player: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxHeight: getSmallestDim() - 62,
  },
});
