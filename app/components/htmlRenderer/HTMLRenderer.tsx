import React, {useCallback, useMemo} from 'react';
import HTML, {RendererFunction} from 'react-native-render-html';
import {View, StyleSheet, Linking, TextStyle} from 'react-native';

import table, {IGNORED_TAGS} from '@native-html/table-plugin';

import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import {useSettings} from '../../settings/useSettings';
import getTableCssRules from './getTableCssRules';
import SafeWebView from '../safeWebView/SafeWebView';

/** Todo remove maybe? It introduces bugs (text not fitting) */
const EXTRA_LINE_SPACING = 7;

interface Props {
  html: string;
}

const renderP: RendererFunction = (_, children, __, passProps) => {
  return (
    <TextComponent key={passProps.key} selectable={true}>
      {children}
    </TextComponent>
  );
};

const renderListPrefix: RendererFunction = (_, children, __, passProps) => {
  const fontSize = (passProps.baseFontStyle as TextStyle)?.fontSize ?? 20;
  const color = (passProps.baseFontStyle as TextStyle)?.textDecorationColor;

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        marginTop: fontSize / 2,
        marginRight: 6,
        width: 6,
        height: 6,
        borderRadius: 6,
        backgroundColor: color,
      }}
    />
  );
};

const renderBlockquote: RendererFunction = (_, children, __, passProps) => {
  return (
    <View style={styles.quoteContainer} key={passProps.key}>
      <TextComponent style={styles.quoteSimbol} fontFamily="SourceSansPro-SemiBold">
        ”
      </TextComponent>
      <TextComponent style={styles.quoteText} selectable={true}>
        {children}
      </TextComponent>
    </View>
  );
};

const HTMLRenderer: React.FC<Props> = ({html}) => {
  const theme = useTheme();
  const {colors} = theme;
  const {textSizeMultiplier} = useSettings();

  const fontSize = useMemo(() => 20 + textSizeMultiplier, [textSizeMultiplier]);

  const baseFontStyle: TextStyle = useMemo(
    () => ({
      color: colors.text,
      fontFamily: 'SourceSansPro-Regular',
      lineHeight: fontSize + EXTRA_LINE_SPACING,
      fontSize: fontSize,
      textDecorationColor: colors.primary,
    }),
    [colors.primary, colors.text, fontSize],
  );

  return (
    <HTML
      source={{
        html,
      }}
      baseFontStyle={baseFontStyle}
      WebView={SafeWebView}
      ignoredTags={IGNORED_TAGS}
      tagsStyles={{
        strong: {
          fontFamily: 'SourceSansPro-SemiBold',
        },
        blockquote: {
          fontFamily: 'SourceSansPro-LightItalic',
          fontSize: fontSize + 3,
        },
        a: {
          color: colors.primary,
        },
      }}
      onLinkPress={useCallback((_, href) => Linking.openURL(href), [])}
      renderers={{
        table,
        blockquote: renderBlockquote,
        p: renderP,
      }}
      listsPrefixesRenderers={{
        ul: renderListPrefix,
      }}
      renderersProps={{
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
  quoteText: {
    flex: 1,
  },
  quoteContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  quoteSimbol: {
    fontSize: 80,
    marginTop: -18,
    paddingEnd: 8,
  },
});
