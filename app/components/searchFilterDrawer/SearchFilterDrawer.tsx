import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import SelectableItem from './selectableItem/SelectableItem';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import Divider from '../divider/Divider';
import {
  SearchFilterTypes,
  SEARCH_TYPE_ALL,
  SEARCH_TYPE_AUDIO,
  SEARCH_TYPE_NEWS,
  SEARCH_TYPE_VIDEO,
  SEARCH_TYPE_VIDEO_SUBTITLES,
} from '../../api/Types';
import {SafeAreaView} from 'react-native-safe-area-context';
import CheckBox from '../checkBox/CheckBox';
import useSearch from '../../screens/search/context/useSearch';
import MyScrollView from '../MyScrollView/MyScrollView';

const SearchFilterDrawer: React.FC<React.PropsWithChildren<{}>> = () => {
  const {colors} = useTheme();

  const {filter, setFilter} = useSearch();
  const {days, section, type} = filter;

  const selectType = useCallback(
    (selectedType: SearchFilterTypes) => {
      setFilter({...filter, type: selectedType});
    },
    [filter, setFilter],
  );

  const selectSection = useCallback(
    (selectedSection: string) => {
      setFilter({...filter, section: selectedSection});
    },
    [filter, setFilter],
  );

  const selectDays = useCallback(
    (selecedDays: '' | '1' | '7' | '30') => {
      setFilter({...filter, days: selecedDays});
    },
    [filter, setFilter],
  );

  const handlePhraseCheckboxClick = useCallback(
    (value: boolean) => {
      setFilter({...filter, searchExactPhrase: value});
    },
    [filter, setFilter],
  );

  const handleHeritageCheckboxClick = useCallback(
    (value: boolean) => {
      setFilter({...filter, searchOnlyHeritage: value});
    },
    [filter, setFilter],
  );

  const checkBoxes = useMemo(() => {
    return (
      <View style={styles.checkBoxesContainer}>
        <CheckBox
          value={filter.searchExactPhrase}
          onValueChange={handlePhraseCheckboxClick}
          label={'Ieškoti tikslios frazės'}
        />
        <CheckBox
          style={styles.checkBoxMargin}
          value={filter.searchOnlyHeritage}
          onValueChange={handleHeritageCheckboxClick}
          label={'Ieškoti tik pavelde'}
        />
      </View>
    );
  }, [
    filter.searchExactPhrase,
    filter.searchOnlyHeritage,
    handleHeritageCheckboxClick,
    handlePhraseCheckboxClick,
  ]);

  const typeSelection = useMemo(() => {
    return (
      <View>
        <TextComponent style={styles.titleText} fontFamily="SourceSansPro-SemiBold">
          TIPAS
        </TextComponent>
        <SelectableItem selected={type === 0} text={'Visi'} onPress={() => selectType(SEARCH_TYPE_ALL)} />
        <SelectableItem
          selected={type === 1}
          text={'Naujienos'}
          onPress={() => selectType(SEARCH_TYPE_NEWS)}
        />
        <SelectableItem selected={type === 2} text={'Audio'} onPress={() => selectType(SEARCH_TYPE_AUDIO)} />
        <SelectableItem selected={type === 3} text={'Video'} onPress={() => selectType(SEARCH_TYPE_VIDEO)} />
        <SelectableItem
          selected={type === 4}
          text={'Video + titrai'}
          onPress={() => selectType(SEARCH_TYPE_VIDEO_SUBTITLES)}
        />
      </View>
    );
  }, [selectType, type]);

  const sectionSelection = useMemo(() => {
    return (
      <View>
        <TextComponent style={styles.titleText} fontFamily="SourceSansPro-SemiBold">
          TEMA
        </TextComponent>
        <SelectableItem selected={section === ''} text={'Visos'} onPress={() => selectSection('')} />
        <SelectableItem
          selected={section === 'aktualijos|lietuvoje|zinios|pasaulyje|panorama'}
          text={'Naujienos'}
          onPress={() => selectSection('aktualijos|lietuvoje|zinios|pasaulyje|panorama')}
        />
        <SelectableItem
          selected={section === 'filmai'}
          text={'Filmai'}
          onPress={() => selectSection('filmai')}
        />
        <SelectableItem
          selected={section === 'serialai'}
          text={'Serialai'}
          onPress={() => selectSection('serialai')}
        />
        <SelectableItem
          selected={section === 'vaikams'}
          text={'Vaikams'}
          onPress={() => selectSection('vaikams')}
        />
        <SelectableItem
          selected={section === 'sportas'}
          text={'Sportas'}
          onPress={() => selectSection('sportas')}
        />
        <SelectableItem
          selected={section === 'kultura'}
          text={'Kultūra'}
          onPress={() => selectSection('kultura')}
        />
        <SelectableItem
          selected={section === 'muzika'}
          text={'Muzika'}
          onPress={() => selectSection('muzika')}
        />
      </View>
    );
  }, [section, selectSection]);

  const dateSelection = useMemo(() => {
    return (
      <View>
        <TextComponent style={styles.titleText} fontFamily="SourceSansPro-SemiBold">
          DATA
        </TextComponent>
        <SelectableItem selected={days === ''} text={'Visos'} onPress={() => selectDays('')} />
        <SelectableItem selected={days === '1'} text={'Per 24 valandas'} onPress={() => selectDays('1')} />
        <SelectableItem selected={days === '7'} text={'Per savaite'} onPress={() => selectDays('7')} />
        <SelectableItem selected={days === '30'} text={'Per 30 d.'} onPress={() => selectDays('30')} />
      </View>
    );
  }, [days, selectDays]);

  return (
    <View style={{...styles.root, backgroundColor: colors.background}}>
      <MyScrollView>
        <SafeAreaView edges={['top', 'bottom']}>
          {checkBoxes}
          {typeSelection}
          <Divider style={styles.divider} />
          {sectionSelection}
          <Divider style={styles.divider} />
          {dateSelection}
        </SafeAreaView>
      </MyScrollView>
    </View>
  );
};

export default SearchFilterDrawer;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minWidth: 200,
  },
  checkBoxesContainer: {
    padding: 8,
  },
  checkBoxMargin: {
    marginTop: 8,
  },
  titleText: {
    padding: 16,
    fontSize: 16,
  },
  divider: {
    marginTop: 16,
  },
});
