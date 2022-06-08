import React, {useCallback, useMemo} from 'react';
import HTML, {
  CustomBlockRenderer,
  CustomTagRendererRecord,
  CustomTextualRenderer,
  defaultSystemFonts,
  getNativePropsForTNode,
  MixedStyleDeclaration,
  RenderersProps,
  TChildrenRenderer,
  TNode,
  TNodeChildrenRenderer,
} from 'react-native-render-html';
import {View, StyleSheet, Linking, useWindowDimensions} from 'react-native';

import TableRenderer, {tableModel} from '@native-html/table-plugin';

import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import getTableCssRules from './getTableCssRules';
import SafeWebView from '../safeWebView/SafeWebView';
import useTextStyle from '../text/useTextStyle';
import {useTextSelector} from '../../screens/article/textSelector/useTextSelector';

const DEFAULT_FONT_SIZE = 19.5;
const EXTRA_LINE_SPACING = 7;
const LI_TAG_VERTICAL_MARGIN = 8;

interface Props {
  html: string;
}

const getText = (node: TNode): string => {
  if (node.type === 'text' && node.data) {
    return node.data;
  }

  return node.children.map(getText).join(' ');
};

const MyTextualRenderer: CustomTextualRenderer = (props) => {
  const nodeProps = getNativePropsForTNode(props);
  const {selectText, unselectText} = useTextSelector();

  const onSelectedHandler = useCallback(
    (selected: boolean) => {
      if (selected) {
        selectText(getText(props.tnode));
      } else {
        unselectText(getText(props.tnode));
      }
    },
    [props.tnode, selectText, unselectText],
  );

  return <TextComponent {...nodeProps} selectable={true} onSelected={onSelectedHandler} />;
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
    }),
    [colors.primary],
  );
};

const HTMLRenderer: React.FC<Props> = ({html}) => {
  const {width} = useWindowDimensions();
  const {colors} = useTheme();

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
      baseStyle={textStyle as MixedStyleDeclaration}
      defaultTextProps={{
        allowFontScaling: true,
      }}
      WebView={SafeWebView}
      systemFonts={fonts}
      tagsStyles={useTagStyles()}
      renderers={renderers}
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
    marginRight: 12,
  },
  quoteText: {
    margin: 8,
  },
});
