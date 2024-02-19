import {StyleSheet, View} from 'react-native';
import {LiveFeedArticle} from '../../../api/Types';
import TextComponent from '../../../components/text/Text';
import {useTheme} from '../../../Theme';

interface Props {
  article: LiveFeedArticle;
}

const LiveFeedArticleItem: React.FC<React.PropsWithChildren<Props>> = ({article}) => {
  const theme = useTheme();
  return (
    <View key={article.id} style={{...styles.container, backgroundColor: theme.colors.lightGreyBackground}}>
      <View style={{flexDirection: 'row', gap: 8}}>
        <TextComponent style={styles.smallTopText} type="secondary">
          {article.category_title}
        </TextComponent>
        <TextComponent style={styles.smallTopText} type="secondary">
          {article.item_date}
        </TextComponent>
      </View>
      <TextComponent style={styles.title} fontFamily="PlayfairDisplay-Regular">
        {article.title}
      </TextComponent>
    </View>
  );
};

export default LiveFeedArticleItem;

const styles = StyleSheet.create({
  container: {
    gap: 4,
    padding: 12,
    borderRadius: 6,
  },
  smallTopText: {
    fontSize: 12,
  },
  title: {
    fontSize: 15,
  },
});
