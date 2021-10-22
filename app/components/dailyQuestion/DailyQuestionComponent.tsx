import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {TouchableDebounce} from '..';
import {DailyQuestionChoice} from '../../api/Types';
import {selectDailyQuestion} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

interface DailyQuestionComponentProps {}

const DailyQuestionComponent: React.FC<DailyQuestionComponentProps> = () => {
  const [vote, setVote] = useState<DailyQuestionChoice>();

  const {colors} = useTheme();

  const renderChoise = useCallback(
    (choice: DailyQuestionChoice) => {
      return (
        <View key={choice.id} style={{...styles.choiceContainer, borderColor: colors.buttonBorder}}>
          <TextComponent style={styles.choice}>{choice.name}</TextComponent>
          <TouchableDebounce style={styles.voteButton} onPress={() => setVote(choice)}>
            <TextComponent style={styles.voteText}>BALSUOTI</TextComponent>
          </TouchableDebounce>
        </View>
      );
    },
    [colors.buttonBorder],
  );

  const renderChoiceVoted = useCallback(
    (choice: DailyQuestionChoice) => {
      return (
        <View key={choice.id} style={{...styles.choiceContainer, borderColor: colors.buttonBorder}}>
          <TextComponent style={styles.choice}>{choice.name}</TextComponent>
          <TextComponent style={styles.voteText}>
            {choice.votes}
            <TextComponent style={styles.voteText}>{choice.percentage}</TextComponent>
          </TextComponent>
        </View>
      );
    },
    [colors.buttonBorder],
  );

  const data = useSelector(selectDailyQuestion);
  if (!data) {
    return null;
  }

  return (
    <View style={{...styles.container, borderColor: colors.buttonBorder}}>
      <View style={styles.topContainer}>
        <TextComponent style={styles.title}>{data.title}</TextComponent>
        {vote && (
          <TextComponent style={styles.subtitle}>
            Iš viso balsavo: <TextComponent style={{color: colors.primaryDark}}>{data.votes}</TextComponent>
          </TextComponent>
        )}
      </View>
      {data.choices.map(vote ? renderChoiceVoted : renderChoise)}
    </View>
  );
};

export default React.memo(DailyQuestionComponent);

const styles = StyleSheet.create({
  container: {
    margin: 8,
    borderWidth: 1,
    flex: 1,
  },
  topContainer: {
    padding: 16,
  },
  choiceContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 20,
  },
  subtitle: {
    fontFamily: 'SourceSansPro-Regular',
    marginTop: 16,
    fontSize: 15,
  },
  choice: {
    flex: 1,
    height: '100%',
    fontFamily: 'SourceSansPro-SemiBold',
    marginTop: 16,
    fontSize: 15,
  },
  voteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginLeft: 12,
  },
  voteText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
  },
});
