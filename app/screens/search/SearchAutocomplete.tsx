import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, TouchableDebounce} from '../../components';
import Divider from '../../components/divider/Divider';
import {useTheme} from '../../Theme';
import Animated, {CurvedTransition} from 'react-native-reanimated';
import {IconSearch} from '../../components/svg';
import {useAutocomplete} from '../../api/hooks/useAutocomplete';

interface Props {
  query?: string;
  onItemPress: (suggestion: string) => void;
}

const SearchAutocomplete: React.FC<React.PropsWithChildren<Props>> = ({query, onItemPress}) => {
  const {data: response, error} = useAutocomplete(query ?? '');
  const suggestions = response?.querySuggestions?.map((s) => s.suggestion) ?? [];
  const {colors} = useTheme();

  if (suggestions.length === 0 || error || !query || query.length < 2) {
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
