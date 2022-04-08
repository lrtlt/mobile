import React, {useCallback} from 'react';
import {View, useWindowDimensions} from 'react-native';
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
            const html = item.el.html;

            if (!html) {
              return null;
            }

            const formatted = html
              //Replace width value without quotes in range 300-2400.
              .replace(
                new RegExp('\\width=\\b([3-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1[0-9]{3}|2[0-3][0-9]{2}|2400)\\b'),
                'width=' + width,
              )
              //Replace width value with quotes in range 300-2400.
              .replace(
                new RegExp(
                  '\\width\\s*=\\s*["\']\\b([3-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1[0-9]{3}|2[0-3][0-9]{2}|2400)\\b["\']',
                ),
                'width="' + width + '"',
              );
            //Remove query height value
            //.replace(new RegExp('\\height\\s*=\\s*["\'](.*?)["\']'), '');

            console.log(formatted);

            return (
              <SafeAutoHeightWebView
                key={i}
                style={{width}}
                scrollEnabled={item?.enable_scroll ? true : false}
                nestedScrollEnabled={true}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={true}
                startInLoadingState={true}
                viewportContent={`width=${width}, user-scalable=no`}
                source={{
                  html: formatted,
                }}
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
