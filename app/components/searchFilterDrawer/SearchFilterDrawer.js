import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {setSearchFilter} from '../../redux/actions';
import SelectableItem from './selectableItem/SelectableItem';
import Styles from './styles';
import {ScrollView} from 'react-native-gesture-handler';
import styles from './styles';

const SearchFilterDrawer = (props) => {
  const selectType = (type) => {
    props.dispatch(setSearchFilter({...props.filter, type}));
  };

  const selectSection = (section) => {
    props.dispatch(setSearchFilter({...props.filter, section}));
  };

  const selectDays = (days) => {
    props.dispatch(setSearchFilter({...props.filter, days}));
  };

  const renderTypeSelection = () => {
    const {type} = props.filter;
    return (
      <View>
        <Text style={Styles.titleText}>TIPAS</Text>
        <SelectableItem selected={type === 0} text={'Visi'} onPress={() => selectType(0)} />
        <SelectableItem selected={type === 1} text={'Naujienos'} onPress={() => selectType(1)} />
        <SelectableItem selected={type === 2} text={'Audio'} onPress={() => selectType(2)} />
        <SelectableItem selected={type === 3} text={'Video'} onPress={() => selectType(3)} />
        <SelectableItem selected={type === 4} text={'Video + titrai'} onPress={() => selectType(4)} />
      </View>
    );
  };

  const renderSectionSelection = () => {
    const {section} = props.filter;
    return (
      <View>
        <Text style={Styles.titleText}>TEMA</Text>
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
    const {days} = props.filter;
    return (
      <View>
        <Text style={Styles.titleText}>DATA</Text>
        <SelectableItem selected={days === ''} text={'Visos'} onPress={() => selectDays('')} />
        <SelectableItem selected={days === '1'} text={'Per 24 valandas'} onPress={() => selectDays('1')} />
        <SelectableItem selected={days === '7'} text={'Per savaite'} onPress={() => selectDays('7')} />
        <SelectableItem selected={days === '30'} text={'Per 30 d.'} onPress={() => selectDays('30')} />
      </View>
    );
  };

  return (
    <View style={Styles.root}>
      <ScrollView>
        <View>
          {renderTypeSelection()}
          <View style={styles.separator} />
          {renderSectionSelection()}
          <View style={styles.separator} />
          {renderDateSelection()}
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {filter: state.navigation.filter};
};

export default connect(mapStateToProps)(SearchFilterDrawer);
