import React from 'react';
import {View, StyleSheet} from 'react-native';
import {setSearchFilter} from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import SelectableItem from './selectableItem/SelectableItem';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../Theme';
import {selectSearchFilter} from '../../redux/selectors';
import TextComponent from '../text/Text';
import Divider from '../divider/Divider';

const SearchFilterDrawer = (_) => {
  const {colors} = useTheme();

  const dispatch = useDispatch();
  const filter = useSelector(selectSearchFilter);

  const selectType = (type) => {
    dispatch(setSearchFilter({...filter, type}));
  };

  const selectSection = (section) => {
    dispatch(setSearchFilter({...filter, section}));
  };

  const selectDays = (days) => {
    dispatch(setSearchFilter({...filter, days}));
  };

  const renderTypeSelection = () => {
    const {type} = filter;
    return (
      <View>
        <TextComponent style={styles.titleText}>TIPAS</TextComponent>
        <SelectableItem selected={type === 0} text={'Visi'} onPress={() => selectType(0)} />
        <SelectableItem selected={type === 1} text={'Naujienos'} onPress={() => selectType(1)} />
        <SelectableItem selected={type === 2} text={'Audio'} onPress={() => selectType(2)} />
        <SelectableItem selected={type === 3} text={'Video'} onPress={() => selectType(3)} />
        <SelectableItem selected={type === 4} text={'Video + titrai'} onPress={() => selectType(4)} />
      </View>
    );
  };

  const renderSectionSelection = () => {
    const {section} = filter;
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
  };

  const renderDateSelection = () => {
    const {days} = filter;
    return (
      <View>
        <TextComponent style={styles.titleText}>DATA</TextComponent>
        <SelectableItem selected={days === ''} text={'Visos'} onPress={() => selectDays('')} />
        <SelectableItem selected={days === '1'} text={'Per 24 valandas'} onPress={() => selectDays('1')} />
        <SelectableItem selected={days === '7'} text={'Per savaite'} onPress={() => selectDays('7')} />
        <SelectableItem selected={days === '30'} text={'Per 30 d.'} onPress={() => selectDays('30')} />
      </View>
    );
  };

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
