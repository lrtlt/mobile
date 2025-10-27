import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {ForecastLocation} from '../../api/Types';
import {TouchableDebounce} from '../../components';
import TextComponent from '../../components/text/Text';
import {useTheme} from '../../Theme';
import {useWeatherForecastLocations} from '../../api/hooks/useWeatherForecast';

interface Props {
  style?: ViewStyle;
  onLocationSelect: (location: ForecastLocation) => void;
}

const WeatherLocations: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<ForecastLocation[]>([]);

  const {data} = useWeatherForecastLocations();
  const locations = data || [];

  const {colors, strings} = useTheme();

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

  const handleLocationSelect = (l: ForecastLocation) => {
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

    fontSize: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  locationTextTitle: {
    fontSize: 16,
  },
  locationTextSubtitle: {
    fontSize: 13,
  },
  resultContainer: {
    padding: 8,
  },
  resultItem: {
    marginVertical: 8,
  },
});
