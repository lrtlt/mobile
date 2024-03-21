import {PropsWithChildren} from 'react';
import {View} from 'react-native';
import {useTheme} from '../../Theme';

interface DotsProps {
  count: number;
  currentIndex: number;
}

const SIZE = 8;

const PagerDots: React.FC<PropsWithChildren<DotsProps>> = ({count, currentIndex}) => {
  const {colors} = useTheme();

  return (
    <View style={{flexDirection: 'row', gap: 8}}>
      {Array.from({length: count}).map((_, index) => {
        return (
          <View
            key={index}
            style={{
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              backgroundColor: currentIndex === index ? colors.primary : colors.programProgress,
            }}
          />
        );
      })}
    </View>
  );
};

export default PagerDots;
