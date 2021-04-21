import React, {useCallback} from 'react';
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

const SearchFilterDrawer: React.FC = () => {
  const {colors} = useTheme();

  const dispatch = useDispatch();

  const filter = useSelector(selectSearchFilter, checkEqual);
  const {days, section, type} = filter;

  const selectType = useCallback(
    (type: SearchFilterTypes) => {
      dispatch(setSearchFilter({...filter, type}));
    },
    [filter],
  );

  const selectSection = useCallback(
    (section: string) => {
      dispatch(setSearchFilter({...filter, section}));
    },
    [filter],
  );

  const selectDays = useCallback(
    (days: '' | '1' | '7' | '30') => {
      dispatch(setSearchFilter({...filter, days}));
    },
    [filter],
  );

  const renderTypeSelection = useCallback(() => {
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
  }, [type]);

  const renderSectionSelection = useCallback(() => {
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
  }, [section]);

  const renderDateSelection = useCallback(() => {
    return (
      <View>
        <TextComponent style={styles.titleText}>DATA</TextComponent>
        <SelectableItem selected={days === ''} text={'Visos'} onPress={() => selectDays('')} />
        <SelectableItem selected={days === '1'} text={'Per 24 valandas'} onPress={() => selectDays('1')} />
        <SelectableItem selected={days === '7'} text={'Per savaite'} onPress={() => selectDays('7')} />
        <SelectableItem selected={days === '30'} text={'Per 30 d.'} onPress={() => selectDays('30')} />
      </View>
    );
  }, [days]);

  return (
    <View style={{...styles.root, backgroundColor: colors.background}}>
      <ScrollView>
        <View>
          {renderTypeSelection()}
          <Divider style={styles.divider} />
          {renderSectionSelection()}
          <Divider style={styles.divider} />
          {renderDateSelection()}
        </View>
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
  titleText: {
    fontFamily: 'SourceSansPro-SemiBold',
    padding: 16,
    fontSize: 16,
  },
  divider: {
    marginTop: 16,
  },
});
