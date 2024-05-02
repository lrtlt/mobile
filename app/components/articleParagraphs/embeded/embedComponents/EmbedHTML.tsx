import React, {useState} from 'react';
import {View} from 'react-native';
import {WebViewSource} from 'react-native-webview/src/WebViewTypes';

import {ArticleEmbedHTMLType} from '../../../../api/Types';
import SafeAutoHeightWebView from '../../../safeWebView/SafeAutoHeightWebView';

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
              const formattedHTML = html
                //Replace width value without quotes in range 300-2400.
                .replace(
                  new RegExp(
                    '\\width=\\b([3-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1[0-9]{3}|2[0-3][0-9]{2}|2400)\\b',
                  ),
                  'width=' + width,
                )
                //Replace width value with quotes in range 300-2400.
                .replace(
                  new RegExp(
                    '\\width\\s*=\\s*["\']\\b([3-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1[0-9]{3}|2[0-3][0-9]{2}|2400)\\b["\']',
                  ),
                  'width="' + width + '"',
                );

              //console.log(formattedHTML);
              source = {
                html: formattedHTML,
              };
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
