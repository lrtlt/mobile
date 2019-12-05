import React from 'react';
import { View, Text, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';
import HTML from 'react-native-render-html';
import { IGNORED_TAGS, alterNode, makeTableRenderer } from 'react-native-render-html-table-bridge';
import Embed from './embeded/Embed';

const renderBlockquote = (_, children, __, passProps) => {
  //console.log(children);
  return (
    <View style={Styles.quoteContainer} key={passProps.key}>
      <Text style={Styles.quoteSimbol}>”</Text>
      <Text
        style={([passProps.tagsStyles.blockquote], [Styles.quoteText])}
        selectable={true}
        textBreakStrategy="simple"
      >
        {children}
      </Text>
    </View>
  );
};

const renderP = (_, children, __, passProps) => {
  //console.log('children', children);
  //console.log('passProps', passProps);
  return (
    <Text
      selectable={true}
      style={passProps.tagsStyles.baseFontStyle}
      textBreakStrategy="simple"
      key={passProps.key}
    >
      {children}
    </Text>
  );
};

const getTextSize = () => {
  return EStyleSheet.value('$articleFontSize') + EStyleSheet.value('$textSizeMultiplier');
};

const tagsStyles = () => {
  return {
    strong: {
      fontFamily: 'SourceSansPro-SemiBold',
    },
    blockquote: {
      fontFamily: 'SourceSansPro-LightItalic',
      fontSize: getTextSize() + 3,
    },
  };
};

const baseFontStyle = () => {
  return {
    color: EStyleSheet.value('$textColor'),
    fontFamily: 'SourceSansPro-Regular',
    lineHeight: getTextSize() + EStyleSheet.value('$paragraphLineExtraSpacing'),
    fontSize: getTextSize(),
  };
};

const config = {
  WebViewComponent: WebView,
};

const renderers = {
  table: makeTableRenderer(config),
  blockquote: renderBlockquote,
  p: renderP,
};

const htmlConfig = {
  alterNode,
  renderers,
  ignoredTags: IGNORED_TAGS,
};

const renderParagrah = (html, key) => {
  return (
    <View style={Styles.paragraphContainer} key={key}>
      <HTML
        baseFontStyle={baseFontStyle()}
        html={html}
        tagsStyles={tagsStyles()}
        onLinkPress={(_, href) => Linking.openURL(href)}
        {...htmlConfig}
      />
    </View>
  );
};

const renderEmbed = (embedArray, key, _itemSelectHandler) => {
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
        key={key + '-e-' + index}
        style={Styles.embedContainer}
        data={embeds}
        pressHandler={_itemSelectHandler}
      />
    );
  });

  return <View>{content}</View>;
};

const paragraphs = props => {
  const content = props.data.map((item, i) => {
    const text = item.p ? renderParagrah(item.p, i) : null;
    const embed = item.embed ? renderEmbed(item.embed, i, props.itemSelectHandler) : null;
    return (
      <View key={i}>
        {text}
        {embed}
      </View>
    );
  });

  return <View style={props.style}>{content}</View>;
};

export default React.memo(paragraphs);
