import React, {useCallback} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {WebViewSource} from 'react-native-webview/lib/WebViewTypes';
import {ArticleEmbedHTMLType} from '../../../../api/Types';
import SafeAutoHeightWebView from '../../../safeWebView/SafeAutoHeightWebView';

interface Props {
  data: ArticleEmbedHTMLType[];
}

const EmbedHTML: React.FC<Props> = ({data}) => {
  const width = useWindowDimensions().width - 12 * 2;
  return (
    <View>
      {data.map(
        useCallback(
          (item, i) => {
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

              console.log(formattedHTML);
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
                androidHardwareAccelerationDisabled={item.long_content === true ? true : false}
                startInLoadingState={true}
                viewportContent={`width=${width}, user-scalable=no`}
                source={source}
                openLinksExternally
              />
            );
          },
          [width],
        ),
      )}
    </View>
  );
};

export default EmbedHTML;
