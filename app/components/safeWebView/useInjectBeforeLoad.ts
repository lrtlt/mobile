import {useMemo} from 'react';
import {WebViewProps} from 'react-native-webview';
import {getLRTCookiebotConsentScript} from '../../util/CookiebotConsentAccept';

const useInjectBeforeLoad = (props: WebViewProps) => {
  const url = props.source && 'uri' in props.source ? props.source.uri : undefined;
  const injectedBeforeLoad = useMemo(() => {
    const consentScript = getLRTCookiebotConsentScript(url);
    const existing = props.injectedJavaScriptBeforeContentLoaded;
    if (consentScript && existing) {
      return consentScript + '\n' + existing;
    }
    return consentScript ?? existing;
  }, [url, props.injectedJavaScriptBeforeContentLoaded]);

  return injectedBeforeLoad;
};

export default useInjectBeforeLoad;
