import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';

const MoreArticlesButton = (props) => {
  const {colors, strings} = useTheme();

  const {category} = props;

  const backgroundColor =
    category.is_slug_block || category.template_id === 999 ? colors.slugBackground : null;

  console.log(props.category);

  const extraPadding = backgroundColor ? 8 : 0;

  return (
    <View style={{backgroundColor}}>
      <TouchableOpacity onPress={props.onPress}>
        <View style={{...styles.container, padding: extraPadding, backgroundColor: colors.greyBackground}}>
          <TextComponent style={styles.title}>{strings.moreButtonText}</TextComponent>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MoreArticlesButton;

const styles = StyleSheet.create({
  container: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  title: {
    fontFamily: 'SourceSansPro-Regular',
    padding: 8,
    fontSize: 16,
  },
});
