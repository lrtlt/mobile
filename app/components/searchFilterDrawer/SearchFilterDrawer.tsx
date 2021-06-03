import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {setSearchFilter} from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import SelectableItem from './selectableItem/SelectableItem';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../Theme';
import {selectSearchFilter} from '../../redux/selectors';
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
import {checkEqual} from '../../util/LodashEqualityCheck';
import {SafeAreaView} from 'react-native-safe-area-context';
import CheckBox from '../checkBox/CheckBox';

const SearchFilterDrawer: React.FC = () => {
  const {colors} = useTheme();

  const dispatch = useDispatch();

  const filter = useSelector(selectSearchFilter, checkEqual);
  const {days, section, type} = filter;

  const selectType = useCallback(
    (selectedType: SearchFilterTypes) => {
      dispatch(setSearchFilter({...filter, type: selectedType}));
    },
    [dispatch, filter],
  );

  const selectSection = useCallback(
    (selectedSection: string) => {
      dispatch(setSearchFilter({...filter, section: selectedSection}));
    },
    [dispatch, filter],
  );

  const selectDays = useCallback(
    (selecedDays: '' | '1' | '7' | '30') => {
      dispatch(setSearchFilter({...filter, days: selecedDays}));
    },
    [dispatch, filter],
  );

  const handlePhraseCheckboxClick = useCallback(
    (value: boolean) => {
      console.log('Phrase: ', value);
      dispatch(
        setSearchFilter({
          ...filter,
          searchExactPhrase: value,
        }),
      );
    },
    [dispatch, filter],
  );

  const handleHeritageCheckboxClick = useCallback(
    (value: boolean) => {
      console.log('Heritage: ', value);
      dispatch(
        setSearchFilter({
          ...filter,
          searchOnlyHeritage: value,
        }),
      );
    },
    [dispatch, filter],
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
          style={styles.topMargin}
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
        <TextComponent style={styles.titleText}>TIPAS</TextComponent>
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
        <TextComponent style={styles.titleText}>TEMA</TextComponent>
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
        <TextComponent style={styles.titleText}>DATA</TextComponent>
        <SelectableItem selected={days === ''} text={'Visos'} onPress={() => selectDays('')} />
        <SelectableItem selected={days === '1'} text={'Per 24 valandas'} onPress={() => selectDays('1')} />
        <SelectableItem selected={days === '7'} text={'Per savaite'} onPress={() => selectDays('7')} />
        <SelectableItem selected={days === '30'} text={'Per 30 d.'} onPress={() => selectDays('30')} />
      </View>
    );
  }, [days, selectDays]);

  return (
    <View style={{...styles.root, backgroundColor: colors.background}}>
      <ScrollView>
        <SafeAreaView edges={['top', 'bottom']}>
          {checkBoxes}
          {typeSelection}
          <Divider style={styles.divider} />
          {sectionSelection}
          <Divider style={styles.divider} />
          {dateSelection}
        </SafeAreaView>
      </ScrollView>
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
  topMargin: {
    marginTop: 8,
  },
  titleText: {
    fontFamily: 'SourceSansPro-SemiBold',
    padding: 16,
    fontSize: 16,
  },
  divider: {
    marginTop: 16,
  },
});