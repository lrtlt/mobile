import React from 'react';
import {View, Linking, StyleSheet} from 'react-native';
import HTML from 'react-native-render-html';
import {IGNORED_TAGS, alterNode, makeTableRenderer} from 'react-native-render-html-table-bridge';
import Embed from './embeded/Embed';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import {useSettings} from '../../settings/useSettings';
import SafeWebView from '../safeWebView/SafeWebView';

/** Todo remove maybe? It introduces bugs (text not fitting) */
const EXTRA_LINE_SPACING = 7;

const renderBlockquote = (_, children, __, passProps) => {
  //console.log(children);
  return (
    <View style={styles.quoteContainer} key={passProps.key}>
      <TextComponent style={styles.quoteSimbol}>”</TextComponent>
      <TextComponent style={{...passProps.tagsStyles.blockquote, ...styles.quoteText}} selectable={true}>
        {children}
      </TextComponent>
    </View>
  );
};

const renderP = (_, children, __, passProps) => {
  // console.log('children', children);
  // console.log('passProps', passProps);
  return (
    <TextComponent style={passProps.tagsStyles.baseFontStyle} key={passProps.key} selectable={true}>
      {children}
    </TextComponent>
  );
};

const renderers = {
  table: makeTableRenderer({
    WebViewComponent: SafeWebView,
  }),
  blockquote: renderBlockquote,
  p: renderP,
};

const htmlConfig = {
  alterNode,
  renderers,
  ignoredTags: IGNORED_TAGS,
};

const ParagraphComponent = ({html}) => {
  const {colors} = useTheme();
  const {textSizeMultiplier} = useSettings();

  const fontSize = 20 + textSizeMultiplier;

  const baseFontStyle = {
    color: colors.text,
    fontFamily: 'SourceSansPro-Regular',
    lineHeight: fontSize + EXTRA_LINE_SPACING,
    fontSize: fontSize,
  };

  return (
    <View style={styles.paragraphContainer}>
      <HTML
        baseFontStyle={baseFontStyle}
        html={html}
        tagsStyles={{
          strong: {
            fontFamily: 'SourceSansPro-SemiBold',
          },
          blockquote: {
            fontFamily: 'SourceSansPro-LightItalic',
            fontSize: fontSize + 3,
          },
        }}
        onLinkPress={(_, href) => Linking.openURL(href)}
        {...htmlConfig}
      />
    </View>
  );
};

const EmbedComponent = ({embedArray, itemSelectHandler}) => {
  const groupedEmbeds = [];
  let i;
  for (i = 0; i < embedArray.length; i++) {
    let j;
    const group = [];
    const currentType = embedArray[i].embed_type;
    for (j = i; j < embedArray.length; j++) {
      if (currentType === embedArray[j].embed_type) {
        group.push(embedArray[j]);
        i++;
      } else {
        break;
      }
    }
    i--;
    groupedEmbeds.push(group);
  }

  const content = groupedEmbeds.map((embeds, index) => {
    return (
      <Embed
        style={styles.embedContainer}
        data={embeds}
        pressHandler={itemSelectHandler}
        key={'embed-' + index}
      />
    );
  });

  return <View>{content}</View>;
};

const ArticleParagraph = (props) => {
  const {p, embed} = props.data;
  const {itemSelectHandler} = props;

  return (
    <>
      {p && <ParagraphComponent html={p} />}
      {embed && <EmbedComponent embedArray={embed} itemSelectHandler={itemSelectHandler} />}
    </>
  );
};

export default ArticleParagraph;

const styles = StyleSheet.create({
  paragraphContainer: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
  },
  embedContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  quoteText: {
    flex: 1,
  },
  quoteContainer: {
    width: '100%',
    marginTop: 12,
    flexDirection: 'row',
  },
  quoteSimbol: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 80,
    marginTop: -18,
    paddingEnd: 12,
  },
});
