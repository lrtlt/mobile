import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import TextComponent from '../../../components/text/Text';

interface Props {
  onDeadline: () => void;
}

const COUNTDOWN_DURATION = 60;

const LiveFeedCountdown: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const [countDown, setCountDown] = useState(COUNTDOWN_DURATION);

  useEffect(() => {
    const deadlineInterval = setInterval(() => {
      setCountDown(COUNTDOWN_DURATION);

      if (props.onDeadline) {
        props.onDeadline();
      }
    }, COUNTDOWN_DURATION * 1000);

    return () => {
      clearInterval(deadlineInterval);
    };
  }, []);

  useEffect(() => {
    const countdownUpdateInterval = setInterval(() => {
      setCountDown((countDown) => Math.max(countDown - 1, 0));
    }, 1000);

    return () => {
      clearInterval(countdownUpdateInterval);
    };
  }, []);

  return (
    <View style={styles.refreshTimeContainer}>
      <TextComponent style={styles.refreshTime}>
        <TextComponent style={{...styles.refreshTime, fontWeight: 'bold'}}>{'TIESIOGIAI'}</TextComponent>
        {`  ${countDown} sek.`}
      </TextComponent>
    </View>
  );
};

export default LiveFeedCountdown;

const styles = StyleSheet.create({
  refreshTimeContainer: {
    height: 80,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(238,0,14,.05)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  refreshTime: {
    color: 'rgb(238, 0, 14)',
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 0.8,
  },
});
