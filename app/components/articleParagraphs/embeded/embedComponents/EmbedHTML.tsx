import React, {useState} from 'react';
import {Platform, View} from 'react-native';
import {WebViewSource} from 'react-native-webview/src/WebViewTypes';

import {ArticleEmbedHTMLType} from '../../../../api/Types';
import SafeAutoHeightWebView from '../../../safeWebView/SafeAutoHeightWebView';
import {extractBlockedIframeSrc, WIDTH_REGEX} from './embedHtmlUtils';

interface Props {
  data: ArticleEmbedHTMLType[];
}

const EmbedHTML: React.FC<React.PropsWithChildren<Props>> = ({data}) => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  const {width} = dimensions;
  return (
    <View
      onLayout={(event) => {
        setDimensions(event.nativeEvent.layout);
      }}>
      {width === 0
        ? null
        : data.map((item, i) => {
            if (item.el.is_timeline) {
              /**
               * Disable html timeline for now because we have native Timeline embed instead.
               */
              return null;
            }

            const {html, src} = item.el;

            let source: WebViewSource | undefined;

            if (src) {
              source = {
                uri: src,
              };
            } else if (html) {
              // On Android, load iframe src directly to avoid ERR_BLOCKED_BY_RESPONSE
              const iframeSrc = Platform.OS === 'android' ? extractBlockedIframeSrc(html) : null;
              if (iframeSrc) {
                source = {
                  uri: iframeSrc,
                };
              } else {
                const formattedHTML = html
                  // Replace width=300..2400 (unquoted) and width="300..2400" (quoted)
                  .replace(WIDTH_REGEX, `width="${width}"`);

                source = {
                  html: formattedHTML,
                };
              }
            }

            if (!source) {
              console.warn('WebView source is null');
              return null;
            }

            return (
              <SafeAutoHeightWebView
                key={i}
                style={{width}}
                scrollEnabled={false}
                nestedScrollEnabled={false}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={true}
                androidLayerType="hardware"
                startInLoadingState={true}
                viewportContent={`width=${width}, user-scalable=no`}
                source={source}
                openLinksExternally
              />
            );
          })}
    </View>
  );
};

export default EmbedHTML;
