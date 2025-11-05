import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import {useTheme} from '../../Theme';
import SearchAutocomplete from './SearchAutocomplete';
import {BorderlessButton} from 'react-native-gesture-handler';
import {IconSearch} from '../../components/svg';
import {useCallback, useEffect, useState} from 'react';

interface Props {
  subHeaderHeight: number;
  onQueryChange: (text: string) => void;
}

const SearchBar: React.FC<React.PropsWithChildren<Props>> = ({onQueryChange, subHeaderHeight}) => {
  const [query, setQuery] = useState<string>('');
  const [autocompleteEnabled, setAutocompleteEnabled] = useState<boolean>(false);

  const {colors, dim} = useTheme();

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidHide', () => {
      setAutocompleteEnabled(false);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const autocompletePressHandler = useCallback(
    (suggestion: string) => {
      setAutocompleteEnabled(false);
      setQuery(suggestion);
      onQueryChange(suggestion);
    },
    [onQueryChange],
  );

  return (
    <View style={{...styles.searchBar, backgroundColor: colors.card}}>
      <View style={{...styles.searchInputHolder, backgroundColor: colors.background}}>
        <TextInput
          style={{...styles.searchInput, color: colors.text}}
          multiline={false}
          placeholder={'Paieška'}
          numberOfLines={1}
          onEndEditing={() => {
            setAutocompleteEnabled(false);
          }}
          autoCorrect={false}
          onSubmitEditing={() => {
            setAutocompleteEnabled(false);
            onQueryChange(query);
          }}
          returnKeyType="search"
          placeholderTextColor={colors.textDisbled}
          onChangeText={(text) => {
            setAutocompleteEnabled(true);
            setQuery(text);
          }}
          value={query}
        />
        <BorderlessButton
          style={styles.searchButton}
          onPress={() => {
            setAutocompleteEnabled(false);
            onQueryChange(query);
          }}>
          <IconSearch size={dim.appBarIconSize} color={colors.headerTint} />
        </BorderlessButton>
      </View>

      {autocompleteEnabled && (
        <View style={{position: 'absolute', top: subHeaderHeight, left: 0, right: 0}}>
          <SearchAutocomplete query={query} onItemPress={autocompletePressHandler} />
        </View>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    padding: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchInputHolder: {
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  searchInput: {
    padding: 8,
    fontSize: 17,
    flex: 1,
  },
  searchButton: {
    height: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
