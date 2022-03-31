import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SearchCategorySuggestion} from '../../api/Types';
import {SearchSuggestion} from '../../components';

interface Props {
  suggestions?: SearchCategorySuggestion[];
  onSearchSuggestionClick: (suggestion: SearchCategorySuggestion) => void;
}

const SearchSuggestions: React.FC<Props> = ({suggestions, onSearchSuggestionClick}) => {
  if (!suggestions) {
    return null;
  }

  return (
    <View style={styles.container}>
      {suggestions.map((s) => (
        <SearchSuggestion style={styles.suggestion} suggestion={s} onPress={onSearchSuggestionClick} />
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
    margin: 4,
    marginTop: 12,
  },
  suggestion: {
    overflow: 'hidden',
    margin: 4,
  },
});
