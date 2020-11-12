import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScreenLoader, ProgramDay, ActionButton} from '../../components';
import EStyleSheet from 'react-native-extended-stylesheet';
import Styles from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {fetchProgram} from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';
import ProgramTabs from './tabs/ProgramTabsScreen';
import Gemius from 'react-native-gemius-plugin';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';
import {selectProgramScreenState} from '../../redux/selectors';

const STATE_LOADING = 'loading';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

const ProgramScreen = (props) => {
  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);

  const {navigation} = props;
  const dispatch = useDispatch();

  const state = useSelector(selectProgramScreenState);
  const {program, loadingState} = state;

  if (!selectedDate) {
    setSelectedDate(program.days[0]);
  }

  console.log('state', state);

  useEffect(() => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {screen: 'program'});
    dispatch(fetchProgram());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ActionButton onPress={() => setHeaderExpanded(!headerExpanded)}>
          <Icon
            size={EStyleSheet.value('$navBarIconSize')}
            color={EStyleSheet.value('$headerTintColor')}
            name="ios-calendar"
          />
        </ActionButton>
      ),
      headerTitle: () => {
        return selectedDate ? (
          <ProgramDay style={Styles.dayHeader} textStyle={Styles.headerText} dateString={selectedDate} />
        ) : (
          ''
        );
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const renderDays = () => {
    const daysComponent = program.days.map((day) => {
      return (
        <TouchableOpacity
          onPress={() => {
            setSelectedDate(day);
            setHeaderExpanded(!headerExpanded);
          }}
          key={day}>
          <View>
            <ProgramDay style={Styles.dayListItem} dateString={day} />
            <View style={Styles.dayListSeparator} />
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
    return <View style={Styles.flexContainer} />;
  };

  const renderProgram = () => {
    const selectedDay = selectedDate || program.days[0];
    const selectedDayProgram = program[selectedDay];
    return (
      <View style={Styles.flexContainer}>
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

  return (
    <View style={Styles.root}>
      <View style={Styles.flexContainer}>{content}</View>
    </View>
  );
};

export default ProgramScreen;
