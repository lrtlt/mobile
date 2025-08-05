import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, TouchableDebounce} from '../../components';
import Divider from '../../components/divider/Divider';
import useAutocompleteApi from './useAutocompleteApi';
import {debounce} from 'lodash';
import {useTheme} from '../../Theme';
import Animated, {CurvedTransition} from 'react-native-reanimated';
import {IconSearch} from '../../components/svg';

interface Props {
  query?: string;
  onItemPress: (suggestion: string) => void;
}

const debounceAPICall = debounce(
  (f: () => void) => {
    return f();
  },
  300,
  {
    leading: true,
    trailing: true,
  },
);

const SearchAutocomplete: React.FC<React.PropsWithChildren<Props>> = ({query, onItemPress}) => {
  const {suggestions, callAutocompleteApi} = useAutocompleteApi();
  const {colors} = useTheme();

  useEffect(() => {
    if (query && query.length > 1) {
      debounceAPICall(() => {
        callAutocompleteApi(query);
      });
    }
  }, [query]);

  if (!suggestions || suggestions.length === 0 || !query || query.length < 2) {
    return null;
  }

  return (
    <Animated.View
      style={{...styles.container, backgroundColor: colors.background}}
      layout={CurvedTransition.duration(100)}>
      {suggestions.map((s, i) => (
        <View key={`item-${i}`}>
          {i > 0 && <Divider />}
          <TouchableDebounce onPress={() => onItemPress(s)}>
            <View style={styles.suggestion}>
              <IconSearch size={14} color={colors.text} />
              <Text style={styles.text} fontFamily="SourceSansPro-SemiBold">
                {s}
              </Text>
            </View>
          </TouchableDebounce>
        </View>
      ))}
    </Animated.View>
  );
};

export default SearchAutocomplete;

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
    marginLeft: 4,
    padding: 12,
  },
  text: {
    fontSize: 18,
  },
});
