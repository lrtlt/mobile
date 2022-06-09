import React from 'react';
import HTML, {
  CustomBlockRenderer,
  defaultHTMLElementModels,
  defaultSystemFonts,
  getNativePropsForTNode,
  HTMLContentModel,
  TChildrenRenderer,
  TNodeChildrenRenderer,
} from 'react-native-render-html';
import {View, StyleSheet, Linking, useWindowDimensions} from 'react-native';

import TableRenderer, {tableModel} from '@native-html/table-plugin';

import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import getTableCssRules from './getTableCssRules';
import SafeWebView from '../safeWebView/SafeWebView';
import useTextStyle from '../text/useTextStyle';

const DEFAULT_FONT_SIZE = 19.5;
const EXTRA_LINE_SPACING = 7;
const LI_TAG_VERTICAL_MARGIN = 8;

interface Props {
  html: string;
}

const ParagraphRenderer: CustomBlockRenderer = (props) => {
  const nodeProps = getNativePropsForTNode(props);
  return React.createElement(TextComponent, nodeProps);
};

const BlockquoteRenderer: CustomBlockRenderer = (props) => {
  const {colors} = useTheme();

  const {TDefaultRenderer, tnode} = props;

  return (
    <TDefaultRenderer {...props}>
      <TextComponent
        style={{...styles.quoteSimbol, color: colors.primary}}
        fontFamily="SourceSansPro-Regular">
        ”
      </TextComponent>

      <View style={styles.flex}>
        <TNodeChildrenRenderer
          tnode={tnode}
          renderChild={(p) => {
            return (
              <View style={styles.quoteText}>
                <TChildrenRenderer tchildren={[p.childTnode]} />
              </View>
            );
          }}
        />
      </View>
    </TDefaultRenderer>
  );
};

const HTMLRenderer: React.FC<Props> = ({html}) => {
  const {width} = useWindowDimensions();

  const theme = useTheme();
  const {colors} = theme;

  const textStyle = useTextStyle({
    type: 'primary',
    scalingEnabled: true,
    fontFamily: 'SourceSansPro-Regular',
    style: {
      fontSize: DEFAULT_FONT_SIZE,
      lineHeight: DEFAULT_FONT_SIZE + EXTRA_LINE_SPACING,
      textDecorationColor: colors.primary,
      marginVertical: 8,
    },
  });

  return (
    <HTML
      source={{
        html,
      }}
      contentWidth={width - 12}
      defaultTextProps={{
        selectable: false,
        allowFontScaling: true,
      }}
      baseStyle={textStyle as any}
      WebView={SafeWebView}
      systemFonts={[
        ...defaultSystemFonts,
        'SourceSansPro-SemiBold',
        'SourceSansPro-Regular',
        'SourceSansPro-LightItalic',
      ]}
      tagsStyles={{
        strong: {
          fontFamily: 'SourceSansPro-SemiBold',
          fontWeight: '900',
        },
        blockquote: {
          margin: 12,
          flexDirection: 'row',
          fontFamily: 'SourceSansPro-LightItalic',
          fontSize: DEFAULT_FONT_SIZE + 3,
        },
        a: {
          color: colors.primary,
        },
        li: {
          paddingVertical: LI_TAG_VERTICAL_MARGIN,
        },
      }}
      customHTMLElementModels={{
        table: tableModel,
        blockquote: defaultHTMLElementModels.blockquote.extend({
          contentModel: HTMLContentModel.block,
          isOpaque: false,
        }),
      }}
      renderers={{
        table: TableRenderer,
        blockquote: BlockquoteRenderer,
        p: ParagraphRenderer,
      }}
      renderersProps={{
        a: {
          onPress: (_, href) => Linking.openURL(href),
        },
        ul: {
          markerBoxStyle: {
            paddingTop: LI_TAG_VERTICAL_MARGIN,
          },
          markerTextStyle: {
            color: colors.primary,
            padding: 4,
          },
        },
        ol: {
          markerBoxStyle: {
            paddingTop: LI_TAG_VERTICAL_MARGIN,
          },
          markerTextStyle: {
            color: colors.primary,
            padding: 4,
          },
        },
        table: {
          cssRules: getTableCssRules(theme),
          startInLoadingState: true,
        },
      }}
    />
  );
};

export default HTMLRenderer;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  quoteSimbol: {
    fontSize: 70,
    marginTop: -8,
    marginRight: 12,
  },
  quoteText: {
    margin: 8,
  },
});
