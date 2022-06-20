import {useWindowDimensions} from 'react-native';

const useOrientation = (): 'portrait' | 'landscape' => {
  const {width, height} = useWindowDimensions();
  return width > height ? 'landscape' : 'portrait';
};

export default useOrientation;
