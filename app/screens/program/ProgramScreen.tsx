import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScreenLoader, ProgramDay, ActionButton} from '../../components';
import {fetchProgram} from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import ProgramTabs from './tabs/ProgramTabsScreen';
import {selectProgramScreenState} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {IconCalendar} from '../../components/svg';
import {MainStackParamList} from '../../navigation/MainStack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import ProgramDateModal from './ProgramDateModal';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Slug'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Slug'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const STATE_LOADING = 'loading';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

const ProgramScreen: React.FC<Props> = ({navigation}) => {
  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const {colors, dim} = useTheme();
  const dispatch = useDispatch();

  const state = useSelector(selectProgramScreenState);
  const loadingState = state.loadingState;
  const program = state.program?.all_programs;

  useEffect(() => {
    if (program) {
      setSelectedDate(program.days[0]);
    }
  }, [program]);

  useEffect(() => {
    dispatch(fetchProgram());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ActionButton onPress={() => setHeaderExpanded(!headerExpanded)}>
          <IconCalendar size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      ),
      headerTitle: () => {
        return selectedDate ? <ProgramDay dateString={selectedDate} /> : <View />;
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerExpanded, selectedDate]);

  let content;
  switch (loadingState) {
    case STATE_LOADING: {
      content = <ScreenLoader />;
      break;
    }
    case STATE_ERROR: {
      content = <View style={styles.root} />;
      break;
    }
    case STATE_READY: {
      const selectedDay = selectedDate || program?.days[0];
      const selectedDayProgram = program![selectedDay];
      content = (
        <View style={styles.root}>
          <ProgramTabs program={selectedDayProgram} />
          <ProgramDateModal
            days={program?.days!}
            onCancel={() => setHeaderExpanded(false)}
            visible={headerExpanded}
            onDateSelected={(index) => {
              setSelectedDate(program?.days[index]);
              setHeaderExpanded(false);
            }}
          />
        </View>
      );
      break;
    }
  }

  return <View style={styles.root}>{content}</View>;
};

export default ProgramScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  dayListItem: {
    padding: 16,
    justifyContent: 'center',
  },
});
