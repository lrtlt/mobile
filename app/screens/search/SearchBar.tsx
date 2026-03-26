import {StyleSheet, TextInput, View} from 'react-native';
import {useTheme} from '../../Theme';
import {BorderlessButton} from 'react-native-gesture-handler';
import {IconSearch} from '../../components/svg';
import {useEffect, useRef, useState} from 'react';

interface Props {
  subHeaderHeight: number;
  onQueryChange: (text: string) => void;
  onValueChange?: (text: string) => void;
}

const SearchBar: React.FC<React.PropsWithChildren<Props>> = ({
  onQueryChange,
  onValueChange,
  subHeaderHeight,
}) => {
  const [query, setQuery] = useState<string>('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const {colors, dim} = useTheme();

  return (
    <View style={{...styles.searchBar, backgroundColor: colors.headerBackground}}>
      <View
        style={{...styles.searchInputHolder, backgroundColor: colors.background, borderColor: colors.border}}>
        <TextInput
          style={{...styles.searchInput, color: colors.text}}
          multiline={false}
          placeholder={'Paieška'}
          numberOfLines={1}
          autoCorrect={false}
          onSubmitEditing={() => {
            onQueryChange(query);
          }}
          returnKeyType="search"
          placeholderTextColor={colors.textDisbled}
          onChangeText={(text) => {
            setQuery(text);
            onValueChange?.(text);
            if (debounceTimer.current) {
              clearTimeout(debounceTimer.current);
            }
            if (text.length >= 3) {
              debounceTimer.current = setTimeout(() => {
                onQueryChange(text);
              }, 400);
            }
          }}
          value={query}
        />
        <BorderlessButton
          style={styles.searchButton}
          onPress={() => {
            onQueryChange(query);
          }}>
          <IconSearch size={dim.appBarIconSize} color={colors.headerTint} />
        </BorderlessButton>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    padding: 12,
    paddingVertical: 8,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    // elevation: 2,
  },
  searchInputHolder: {
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // elevation: 2,
    borderWidth: 1,
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
