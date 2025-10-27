import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScreenLoader, ProgramDay, ActionButton, ScreenError} from '../../components';
import ProgramTabs from './tabs/ProgramTabsScreen';
import {strings, useTheme} from '../../Theme';
import {IconCalendar} from '../../components/svg';
import {MainStackParamList} from '../../navigation/MainStack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import ProgramDateModal from './ProgramDateModal';
import {delay} from 'lodash';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import {useWeeklyProgram} from '../../api/hooks/useProgram';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Program'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Program'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const ProgramScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoadingSelection, setIsLoadingSelection] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const {colors, dim} = useTheme();

  const {data, error, isLoading} = useWeeklyProgram();

  const program = data?.all_programs;

  useEffect(() => {
    if (program && !selectedDate) {
      setSelectedDate(program.days[0]);
    }
  }, [program, selectedDate]);

  useNavigationAnalytics({
    viewId: 'https://www.lrt.lt/programa',
    title: 'TV / Radijo programa savaitei - LRT',
    sections: ['Bendra'],
  });

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
    case !!program: {
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
    case isLoading: {
      content = <ScreenLoader />;
      break;
    }
    case !!error: {
      content = <ScreenError text={strings.error_common} />;
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
