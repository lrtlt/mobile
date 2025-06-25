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
      li: {
        paddingVertical: LI_TAG_VERTICAL_MARGIN,
      },
      h4: {
        fontSize: DEFAULT_FONT_SIZE + 2,
        paddingTop: 8,
        paddingBottom: 20,
        borderBottomColor: colors.listSeparator,
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
          borderRadius: 4,
          padding: 12,
          borderWidth: 1,
          borderColor: colors.listSeparator,
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
});
