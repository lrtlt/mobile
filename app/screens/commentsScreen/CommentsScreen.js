import React from 'react';
import {View, SafeAreaView} from 'react-native';
import Styles from './styles';
import {FacebookComments} from '../../components';
import EStyleSheet from 'react-native-extended-stylesheet';

class CommentsScreen extends React.PureComponent {
  render() {
    const url = this.props.navigation.state.params.url;

    return (
      <SafeAreaView style={Styles.container} backgroundColor={EStyleSheet.value('$white')}>
        <View style={Styles.flex}>
          <FacebookComments url={url} />
        </View>
      </SafeAreaView>
    );
  }
}

export default CommentsScreen;
