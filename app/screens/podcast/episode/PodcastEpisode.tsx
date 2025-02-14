import {PropsWithChildren} from 'react';
import {ArticleContentMedia} from '../../../api/Types';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../components';

import {useTheme} from '../../../Theme';
import PlayButton from '../../main/tabScreen/radioteka/components/play_button/play_button';

interface Props {
  article: ArticleContentMedia;
  onPlayPress: () => void;
}

const PodcastEpisode: React.FC<PropsWithChildren<Props>> = ({article, onPlayPress}) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.root, {backgroundColor: colors.tabBarBackground}]}>
      <PlayButton onPress={onPlayPress} />
      <View style={{flex: 1, gap: 6}}>
        <View style={{flexDirection: 'row', gap: 8}}>
          <Text style={styles.caption}>{article.category_title}</Text>
          <Text style={styles.caption}>{article.date}</Text>
        </View>
        <Text style={styles.title}>{article.title}</Text>
      </View>
    </View>
  );
};

export default PodcastEpisode;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    margin: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  title: {
    fontSize: 15,
  },
  caption: {
    fontSize: 12,
  },
});
