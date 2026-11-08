import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Article} from '../../../../Types';
import {useTheme} from '../../../Theme';
import TextComponent from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import {getChainItemTarget} from './getChainItemTarget';

interface Props {
  article: Article;
  onPress: (article: Article) => void;
  style?: ViewStyle;
}

const ArticleChainItems: React.FC<Props> = ({article, onPress, style}) => {
  const {colors} = useTheme();
  const items = article.chain_items;

  if (!items?.length) {
    return null;
  }

  return (
    <View style={style}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <TouchableDebounce
            key={item.chain_item_id ?? item.id ?? index}
            debounceTime={500}
            onPress={() => onPress(getChainItemTarget(article, item))}
            activeOpacity={0.8}
            accessibilityRole="link">
            <View style={styles.itemRow}>
              <View style={styles.bulletColumn}>
                <View
                  style={[
                    styles.bullet,
                    index === 0
                      ? {backgroundColor: colors.primary, borderColor: colors.primary}
                      : {backgroundColor: 'transparent', borderColor: colors.primary},
                  ]}
                />
                {!isLast && <View style={[styles.line, {backgroundColor: colors.textDisbled}]} />}
              </View>
              <TextComponent style={styles.itemText} numberOfLines={2}>
                {item.title}
              </TextComponent>
            </View>
          </TouchableDebounce>
        );
      })}
    </View>
  );
};

export default ArticleChainItems;

const BULLET_SIZE = 8;
const BULLET_COLUMN_WIDTH = 24;

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletColumn: {
    width: BULLET_COLUMN_WIDTH,
    alignItems: 'center',
    paddingTop: 6,
  },
  bullet: {
    width: BULLET_SIZE,
    height: BULLET_SIZE,
    borderRadius: BULLET_SIZE / 2,
    borderWidth: 1.5,
  },
  line: {
    flex: 1,
    width: 1,
    marginTop: 12,
    marginBottom: 4,
    minHeight: 16,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    paddingBottom: 12,
  },
});
