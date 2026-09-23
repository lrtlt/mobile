import React from 'react';
import {StyleSheet, View} from 'react-native';
import {getCrashlytics, log, recordError} from '@react-native-firebase/crashlytics';

import {useTheme} from '../../Theme';
import ScreenError from '../screenError/ScreenError';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import TextComponent from '../text/Text';

interface Props {
  /** Used to tag the error in Crashlytics, e.g. the tab or screen name. */
  name?: string;
  onRetry?: () => void;
}

interface State {
  error?: Error;
}

/**
 * Catches render errors in its subtree and shows a ScreenError with a retry button
 * instead of letting the exception unmount the whole app.
 */
export default class ErrorBoundary extends React.Component<React.PropsWithChildren<Props>, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return {error};
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const crashlytics = getCrashlytics();
    log(crashlytics, `ErrorBoundary(${this.props.name ?? 'unknown'}) componentStack: ${info.componentStack}`);
    recordError(crashlytics, error);
  }

  private retry = () => {
    this.setState({error: undefined});
    this.props.onRetry?.();
  };

  render() {
    if (this.state.error) {
      return <ErrorFallback onRetry={this.retry} />;
    }
    return this.props.children;
  }
}

const ErrorFallback: React.FC<{onRetry: () => void}> = ({onRetry}) => {
  const {colors, strings} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <ScreenError
        text={strings.error_common}
        actions={
          <TouchableDebounce
            style={[styles.button, {backgroundColor: colors.primary}]}
            onPress={onRetry}
            accessibilityRole="button">
            <TextComponent style={[styles.buttonText, {color: colors.onPrimary}]} fontFamily="SourceSansPro-Regular">
              {strings.tryAgain}
            </TextComponent>
          </TouchableDebounce>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    borderRadius: 6,
    marginTop: 24,
  },
  buttonText: {
    padding: 12,
  },
});
