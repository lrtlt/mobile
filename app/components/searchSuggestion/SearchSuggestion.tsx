import React, {useCallback} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {SearchCategorySuggestion} from '../../api/Types';
import {useTheme} from '../../Theme';
import {CameraIcon, MicIcon} from '../svg';
import TextComponent from '../text/Text';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';

interface Props {
  style?: ViewStyle;
  suggestion: SearchCategorySuggestion;
  onPress: (suggestion: SearchCategorySuggestion) => void;
}

const SearchSuggestion: React.FC<React.PropsWithChildren<Props>> = ({style, suggestion, onPress}) => {
  const {colors} = useTheme();

  const renderIcon = useCallback(() => {
    if (suggestion.is_video === 1) {
      return <CameraIcon style={styles.icon} size={16} colorBase="#B6BECB" colorAccent="#D5DAE2" />;
    }
    if (suggestion.is_audio === 1) {
      return <MicIcon style={styles.icon} size={16} colorBase="#B6BECB" colorAccent="#D5DAE2" />;
    }
    return null;
  }, [suggestion.is_audio, suggestion.is_video]);

  const onPressHandler = useCallback(() => {
    onPress(suggestion);
  }, [onPress, suggestion]);

  return (
    <TouchableDebounce
      style={[
        styles.container,
        {
          borderColor: colors.buttonBorder,
        },
        style,
      ]}
      onPress={onPressHandler}>
      {renderIcon()}
      <TextComponent type="secondary" fontFamily="SourceSansPro-Regular">
        {suggestion.category_title}
      </TextComponent>
    </TouchableDebounce>
  );
};

export default SearchSuggestion;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
});
