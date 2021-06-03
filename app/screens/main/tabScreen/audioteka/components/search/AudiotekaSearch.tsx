import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {SEARCH_TYPE_AUDIO} from '../../../../../../api/Types';
import {MoreArticlesButton} from '../../../../../../components';
import Divider from '../../../../../../components/divider/Divider';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {useTheme} from '../../../../../../Theme';

interface AudiotekaSearchProps {}

const AudiotekaSearch: React.FC<AudiotekaSearchProps> = () => {
  const [inputValue, setInputValue] = useState('');

  const {colors, strings} = useTheme();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const searchPressHandler = useCallback(() => {
    navigation.navigate('Search', {
      screen: 'SearchScreen',
      params: {
        q: inputValue,
        filter: {
          searchExactPhrase: true,
          searchOnlyHeritage: false,
          type: SEARCH_TYPE_AUDIO,
          section: '',
          days: '',
        },
      },
    });
  }, [inputValue]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={{...styles.searchInput, color: colors.text, borderColor: colors.listSeparator}}
          multiline={false}
          placeholder={strings.audiotekaSearchPlaceholder}
          numberOfLines={1}
          returnKeyType="done"
          //onSubmitEditing={searchPressHandler}
          placeholderTextColor={colors.textDisbled}
          onChangeText={(text) => setInputValue(text)}
          value={inputValue}
        />
        <Divider />
      </View>
      <MoreArticlesButton onPress={searchPressHandler} customText={strings.search} />
    </View>
  );
};

export default AudiotekaSearch;

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingBottom: 16,
  },
  inputContainer: {
    paddingHorizontal: 8,
  },
  searchInput: {
    paddingVertical: 8,
    width: '100%',
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
