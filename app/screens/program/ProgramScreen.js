import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScreenLoader, ProgramDay, ActionButton} from '../../components';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {fetchProgram} from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import Collapsible from 'react-native-collapsible';
import ProgramTabs from './tabs/ProgramTabsScreen';
import Gemius from 'react-native-gemius-plugin';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import {selectProgramScreenState} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import Divider from '../../components/divider/Divider';
import {IconCalendar} from '../../components/svg';

const STATE_LOADING = 'loading';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

const ProgramScreen = (props) => {
  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);

  const {navigation} = props;

  const {colors, dim} = useTheme();

  const dispatch = useDispatch();

  const state = useSelector(selectProgramScreenState);

  const {program, loadingState} = state;

  useEffect(() => {
    if (program) {
      setSelectedDate(program.days[0]);
    }
  }, [program]);

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {screen: 'program'});
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
        return selectedDate ? (
          <ProgramDay
            style={styles.dayHeader}
            textStyle={{...styles.headerText, color: colors.headerTint}}
            dateString={selectedDate}
          />
        ) : (
          <View />
        );
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const renderDays = () => {
    const daysComponent = program.days.map((day) => {
      return (
        <TouchableOpacity
          key={day}
          onPress={() => {
            setSelectedDate(day);
            setHeaderExpanded(!headerExpanded);
          }}>
          <View>
            <ProgramDay style={styles.dayListItem} dateString={day} />
            <Divider />
          </View>
        </TouchableOpacity>
      );
    });

    return <View>{daysComponent}</View>;
  };

  const renderLoading = () => {
    return <ScreenLoader />;
  };

  const renderError = () => {
    //TODO implement
    return <View style={styles.flexContainer} />;
  };

  const renderProgram = () => {
    const selectedDay = selectedDate || program.days[0];
    const selectedDayProgram = program[selectedDay];
    return (
      <View style={styles.root}>
        <Collapsible collapsed={!headerExpanded}>{renderDays()}</Collapsible>
        <ProgramTabs program={selectedDayProgram} />
      </View>
    );
  };

  let content;
  switch (loadingState) {
    case STATE_LOADING: {
      content = renderLoading();
      break;
    }
    case STATE_ERROR: {
      content = renderError();
      break;
    }
    case STATE_READY: {
      content = renderProgram();
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
  dayHeader: {
    height: '100%',
    justifyContent: 'center',
  },
  dayListItem: {
    padding: 16,
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
  },
});
