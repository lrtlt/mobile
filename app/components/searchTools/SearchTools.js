import React, { useState } from 'react';
import { View, Picker, Text } from 'react-native';

import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';

const SearchTools = props => {
  const [selectedType, setSelectedType] = useState(0);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDays, setSelectedDays] = useState('');

  const textColor = EStyleSheet.value('$textColor');

  return (
    <View style={Styles.root}>
      <View style={Styles.column}>
        <View style={Styles.titleContainer}>
          <Text style={Styles.titleText}>TIPAS</Text>
        </View>
        <Picker
          itemStyle={Styles.itemText}
          prompt="Tipas"
          selectedValue={selectedType}
          onValueChange={(itemValue, itemIndex) => setSelectedType(itemValue)}
        >
          <Picker.Item label="Visi" value={0} color={textColor} />
          <Picker.Item label="Naujienos" value={1} color={textColor} />
          <Picker.Item label="Audio" value={2} color={textColor} />
          <Picker.Item label="Video" value={3} color={textColor} />
          <Picker.Item label="Video + titrai" value={4} color={textColor} />
        </Picker>
      </View>
      <View style={Styles.column}>
        <View style={Styles.titleContainer}>
          <Text style={Styles.titleText}>TEMA</Text>
        </View>
        <Picker
          itemStyle={Styles.itemText}
          prompt="Tema"
          selectedValue={selectedSection}
          onValueChange={(itemValue, itemIndex) => setSelectedSection(itemValue)}
        >
          <Picker.Item label="Visos" value="" color={textColor} />
          <Picker.Item
            label="Naujienos"
            value="aktualijos|lietuvoje|zinios|pasaulyje|panorama"
            color={textColor}
          />
          <Picker.Item label="Filmai" value="filmai" color={textColor} />
          <Picker.Item label="Serialai" value="serialai" color={textColor} />
          <Picker.Item label="Vaikams" value="vaikams" color={textColor} />
          <Picker.Item label="Sportas" value="sportas" color={textColor} />
          <Picker.Item label="Kultūra" value="kultura" color={textColor} />
          <Picker.Item label="Muzika" value="muzika" color={textColor} />
        </Picker>
      </View>
      <View style={Styles.column}>
        <View style={Styles.titleContainer}>
          <Text style={Styles.titleText}>DATA</Text>
        </View>
        <Picker
          itemStyle={Styles.itemText}
          prompt="Data"
          selectedValue={selectedDays}
          onValueChange={(itemValue, itemIndex) => setSelectedDays(itemValue)}
        >
          <Picker.Item label="Visos" value="" color={textColor} />
          <Picker.Item label="Per 24 valandas" value="1" color={textColor} />
          <Picker.Item label="Per savaite" value="7" color={textColor} />
          <Picker.Item label="Per 30 d." value="30" color={textColor} />
        </Picker>
      </View>
    </View>
  );
};

export default SearchTools;
