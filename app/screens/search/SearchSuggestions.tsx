import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SearchCategorySuggestion} from '../../api/Types';
import {SearchSuggestion} from '../../components';

interface Props {
  suggestions?: SearchCategorySuggestion[];
  onSearchSuggestionClick: (suggestion: SearchCategorySuggestion) => void;
}

const SearchSuggestions: React.FC<React.PropsWithChildren<Props>> = ({
  suggestions,
  onSearchSuggestionClick,
}) => {
  if (!suggestions) {
    return null;
  }

  return (
    <View style={styles.container}>
      {suggestions.map((s, i) => (
        <SearchSuggestion
          key={`${i}-${s.category_id}`}
          style={styles.suggestion}
          suggestion={s}
          onPress={onSearchSuggestionClick}
        />
      ))}
    </View>
  );
};

export default SearchSuggestions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  suggestion: {
    overflow: 'hidden',
    maxWidth: '100%',
  },
});
