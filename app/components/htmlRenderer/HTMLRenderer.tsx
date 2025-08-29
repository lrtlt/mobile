import React, {useMemo} from 'react';
import HTML, {
  CustomBlockRenderer,
  CustomTagRendererRecord,
  CustomTextualRenderer,
  defaultSystemFonts,
  getNativePropsForTNode,
  MixedStyleDeclaration,
  RenderersProps,
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

const DEFAULT_FONT_SIZE = 18.5;
const EXTRA_LINE_SPACING = 10;
const LI_TAG_VERTICAL_MARGIN = 8;

interface Props {
  html: string;
  textSize?: number;
}

const MyTextualRenderer: CustomTextualRenderer = (props) => {
  const nodeProps = getNativePropsForTNode(props);
  return React.createElement(TextComponent, {...nodeProps, selectable: true});
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
              <View key={p.key} style={styles.quoteText}>
                <TChildrenRenderer tchildren={[p.childTnode]} />
              </View>
            );
          }}
        />
      </View>
    </TDefaultRenderer>
  );
};

const ULRenderer: CustomBlockRenderer = (props) => {
  const {colors} = useTheme();

  const {TDefaultRenderer, tnode} = props;

  return (
    <TDefaultRenderer {...props} style={{flexDirection: 'row'}}>
      <View style={styles.flex}>
        <TNodeChildrenRenderer
          tnode={tnode}
          renderChild={(p) => {
            return (
              <View
                key={p.key}
                style={{
                  ...styles.liContainer,
                  borderColor: colors.tertiary,
                  borderTopWidth: p.index === 0 ? 2 : 0,
                  paddingTop: p.index === 0 ? LI_TAG_VERTICAL_MARGIN + 12 : LI_TAG_VERTICAL_MARGIN,
                }}>
                <View
                  style={{
                    ...styles.bubble,
                    borderColor: colors.text,
                  }}
                />
                <TChildrenRenderer tchildren={[p.childTnode]} />
              </View>
            );
          }}
        />
      </View>
    </TDefaultRenderer>
  );
};

const renderers: CustomTagRendererRecord = {
  table: TableRenderer,
  blockquote: BlockquoteRenderer,
  p: MyTextualRenderer,
  li: MyTextualRenderer,
  h5: MyTextualRenderer,
  h4: MyTextualRenderer,
  h3: MyTextualRenderer,
  h2: MyTextualRenderer,
  h1: MyTextualRenderer,
  ul: ULRenderer,
};

const fonts: string[] = [
  ...defaultSystemFonts,
  'SourceSansPro-SemiBold',
  'SourceSansPro-Regular',
  'SourceSansPro-LightItalic',
];

const useRendererProps = (): Partial<RenderersProps> => {
  const theme = useTheme();
  const {colors} = theme;

  return useMemo(
    () => ({
      a: {
        onPress: (_, href) => Linking.openURL(href),
      },
      ul: {
        markerBoxStyle: {
          paddingTop: LI_TAG_VERTICAL_MARGIN,
        },
        markerTextStyle: {
          color: colors.tertiary,
          padding: 4,
        },
      },
      ol: {
        markerBoxStyle: {
          paddingTop: LI_TAG_VERTICAL_MARGIN,
        },
        markerTextStyle: {
          color: colors.tertiary,
          padding: 4,
        },
      },
      table: {
        cssRules: getTableCssRules(theme),
        startInLoadingState: true,
      },
    }),
    [colors.primary, theme],
  );
};

const useTagStyles = (): Record<string, MixedStyleDeclaration> => {
  const {colors} = useTheme();

  return useMemo(
    () => ({
      p: {
        marginVertical: 4,
        alignSelf: 'center',
        minWidth: '100%',
      },
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
      em: {
        fontFamily: 'SourceSansPro-LightItalic',
      },
      li: {
        // paddingVertical: LI_TAG_VERTICAL_MARGIN,
        flex: 1,
        fontSize: 16,
        lineHeight: 26,
      },
      h4: {
        fontSize: DEFAULT_FONT_SIZE,
        paddingTop: 8,
        paddingBottom: 20,
        borderBottomColor: colors.listSeparator,
        fontFamily: 'SourceSansPro-SemiBold',
        borderBottomWidth: 1,
        textTransform: 'uppercase',
      },
    }),
    [colors.primary],
  );
};

const HTMLRenderer: React.FC<React.PropsWithChildren<Props>> = ({html, textSize}) => {
  const {width} = useWindowDimensions();
  const {colors} = useTheme();

  const textStyle = useTextStyle({
    type: 'primary',
    scalingEnabled: true,
    fontFamily: 'SourceSansPro-Regular',
    style: {
      fontSize: textSize ?? DEFAULT_FONT_SIZE,
      lineHeight: (textSize ?? DEFAULT_FONT_SIZE) + EXTRA_LINE_SPACING,
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
      baseStyle={textStyle as MixedStyleDeclaration}
      defaultTextProps={{
        allowFontScaling: true,
      }}
      WebView={SafeWebView}
      systemFonts={fonts}
      tagsStyles={useTagStyles()}
      renderers={renderers}
      classesStyles={{
        'article-details-block': {
          backgroundColor: colors.slugBackground,
          borderRadius: 8,
          padding: 12,
          marginVertical: 32,
        },
      }}
      renderersProps={useRendererProps()}
      customHTMLElementModels={{
        table: tableModel,
      }}
    />
  );
};

export default React.memo(HTMLRenderer, (prevProps, nextProps) => prevProps.html === nextProps.html);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  quoteSimbol: {
    fontSize: 70,
    marginRight: 4,
  },
  quoteText: {
    margin: 8,
  },
  bubble: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderRadius: 6,
    marginTop: LI_TAG_VERTICAL_MARGIN + 2,
  },
  liContainer: {
    paddingVertical: LI_TAG_VERTICAL_MARGIN + 4,
    flexDirection: 'row',
    gap: 8,
    padding: 6,
  },
});
