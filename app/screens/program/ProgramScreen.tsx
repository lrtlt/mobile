import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScreenLoader, ProgramDay, ActionButton} from '../../components';
import ProgramTabs from './tabs/ProgramTabsScreen';
import {useTheme} from '../../Theme';
import {IconCalendar} from '../../components/svg';
import {MainStackParamList} from '../../navigation/MainStack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import ProgramDateModal from './ProgramDateModal';
import useAppStateCallback from '../../hooks/useAppStateCallback';
import {ARTICLE_EXPIRE_DURATION} from '../../constants';
import {delay} from 'lodash';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import {useProgramStore} from '../../state/program_store';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Program'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Program'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const STATE_LOADING = 'loading';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

const ProgramScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoadingSelection, setIsLoadingSelection] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const {colors, dim} = useTheme();
  // const dispatch = useDispatch();
  // const state = useSelector(selectProgramScreenState);

  const programStore = useProgramStore((state) => state);

  const loadingState = programStore.isError
    ? STATE_ERROR
    : programStore.isFetching || !programStore.program
    ? STATE_LOADING
    : STATE_READY;

  const program = programStore.program?.all_programs;
  const lastFetchTime = programStore.lastFetchTime;

  useEffect(() => {
    if (program && !selectedDate) {
      setSelectedDate(program.days[0]);
    }
  }, [program, selectedDate]);

  useEffect(() => {
    programStore.fetchProgram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useNavigationAnalytics({
    viewId: 'https://www.lrt.lt/programa',
    title: 'TV / Radijo programa savaitei - LRT',
    sections: ['Bendra'],
  });

  useAppStateCallback(
    useCallback(() => {
      if (Date.now() - lastFetchTime > ARTICLE_EXPIRE_DURATION) {
        programStore.fetchProgram();
      }
    }, [lastFetchTime]),
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ActionButton onPress={() => setModalVisible(!modalVisible)} accessibilityLabel="Pasirinkti datą">
          <IconCalendar size={dim.appBarIconSize} color={colors.headerTint} />
        </ActionButton>
      ),
      headerTitle: () => {
        return selectedDate ? <ProgramDay dateString={selectedDate} /> : <View />;
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible, selectedDate]);

  let content;
  switch (true) {
    case loadingState === STATE_READY || programStore.lastFetchTime > 0: {
      const selectedDay = selectedDate || program?.days[0];
      const selectedDayProgram = program![selectedDay];

      //This is a workaround for tab-view crash when count of tabs changes
      if (isLoadingSelection) {
        content = <ScreenLoader />;
        delay(() => {
          setIsLoadingSelection(false);
        }, 250);
      } else {
        content = (
          <View style={styles.root}>
            <ProgramTabs program={selectedDayProgram} />
            <ProgramDateModal
              days={program?.days!}
              onCancel={() => setModalVisible(false)}
              visible={modalVisible}
              onDateSelected={(index) => {
                setIsLoadingSelection(true);
                setSelectedDate(program?.days[index]);
                setModalVisible(false);
              }}
            />
          </View>
        );
      }
      break;
    }
    case loadingState === STATE_LOADING: {
      content = <ScreenLoader />;
      break;
    }
    case loadingState === STATE_ERROR: {
      content = <View style={styles.root} />;
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
