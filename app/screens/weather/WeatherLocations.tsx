import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {weatherLocationsGet} from '../../api';
import {TouchableDebounce} from '../../components';
import TextComponent from '../../components/text/Text';
import {useTheme} from '../../Theme';
import {Location} from './Types';

interface Props {
  style?: ViewStyle;
  onLocationSelect: (location: Location) => void;
}

const WeatherLocations: React.FC<Props> = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchResults, setSearchResults] = useState<Location[]>([]);

  const {colors, strings} = useTheme();

  useEffect(() => {
    const callApi = async () => {
      const response = await fetch(weatherLocationsGet());
      const result = await response.json();
      //console.log('LOCATIONS API RESPONSE', result);
      return result;
    };

    callApi()
      .then((response) => setLocations(response))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (inputValue && inputValue.length > 2) {
      const results = locations.filter((l) => {
        return (
          l.n.toLowerCase().includes(inputValue.toLowerCase()) ||
          l.c.toLowerCase().includes(inputValue.toLowerCase())
        );
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [inputValue, locations]);

  const handleLocationSelect = (l: Location) => {
    props.onLocationSelect(l);
    setInputValue('');
  };

  const renderSearchResults = () => {
    if (!searchResults || searchResults.length === 0) {
      return null;
    }

    const resultItems = searchResults.map((l) => (
      <View key={l.c} style={styles.resultItem}>
        <TouchableDebounce onPress={() => handleLocationSelect(l)}>
          <TextComponent style={styles.locationTextTitle}>{l.n}</TextComponent>
          <TextComponent style={styles.locationTextSubtitle} type="secondary">
            {l.ad}
          </TextComponent>
        </TouchableDebounce>
      </View>
    ));
    return <View style={styles.resultContainer}>{resultItems}</View>;
  };
  return (
    <View style={props.style}>
      <TextInput
        style={{...styles.searchInput, color: colors.text, borderColor: colors.listSeparator}}
        multiline={false}
        placeholder={strings.locationSearch}
        numberOfLines={1}
        returnKeyType="done"
        placeholderTextColor={colors.textDisbled}
        onChangeText={(text) => setInputValue(text)}
        value={inputValue}
      />
      {renderSearchResults()}
    </View>
  );
};

export default WeatherLocations;

const styles = StyleSheet.create({
  container: {},
  searchInput: {
    paddingVertical: 8,
    width: '100%',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  locationTextTitle: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
  },
  locationTextSubtitle: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
  },
  resultContainer: {
    padding: 8,
  },
  resultItem: {
    marginVertical: 8,
  },
});
