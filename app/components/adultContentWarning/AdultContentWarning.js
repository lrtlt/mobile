import React from 'react';
import {View, Text} from 'react-native';
import Styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';
import {RectButton} from 'react-native-gesture-handler';

const component = (props) => {
  return (
    <View style={Styles.container}>
      <View style={Styles.headerRow}>
        <Text style={Styles.textBadge}>N-18</Text>
        <Text style={Styles.title}>DĖMESIO!</Text>
      </View>
      <Text style={Styles.text}>
        {'Čia pateikiama informacija skirta asmenims nuo'} {<Text style={Styles.textRed}>18 metų</Text>}
      </Text>
      <View style={Styles.buttonRow}>
        <RectButton
          style={Styles.button}
          rippleColor={EStyleSheet.value('$rippleColor')}
          underlayColor={EStyleSheet.value('$primary')}
          onPress={props.onAccept}>
          <View style={Styles.buttonPositive}>
            <Text style={Styles.buttonPositiveText}>MAN JAU YRA 18 METŲ</Text>
          </View>
        </RectButton>
        <View style={Styles.buttonSpace} />
        <RectButton
          style={Styles.button}
          rippleColor={EStyleSheet.value('$rippleColor')}
          underlayColor={EStyleSheet.value('$primary')}
          onPress={props.onDecline}>
          <View style={Styles.buttonNegative}>
            <Text style={Styles.buttonNegativeText}>MAN DAR NĖRA 18 METŲ</Text>
          </View>
        </RectButton>
      </View>
    </View>
  );
};

export default component;
