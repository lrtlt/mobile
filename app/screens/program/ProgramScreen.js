import React from 'react';
import { View } from 'react-native';
import { ScreenLoader, ProgramDay, ActionButton } from '../../components';
import EStyleSheet from 'react-native-extended-stylesheet';
import Styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { fetchProgram } from '../../redux/actions';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';
import ProgramTabs from './tabs/ProgramTabsScreen';
import Gemius from 'react-native-gemius-plugin';
import { GEMIUS_VIEW_SCRIPT_ID } from '../../constants';

const STATE_LOADING = 'loading';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

class ProgramScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('titleComponent', null);
    return {
      headerRight: (
        <ActionButton
          onPress={() => {
            const { params } = navigation.state;
            if (params && params.calendarHandler) {
              params.calendarHandler();
            }
          }}
        >
          <Icon
            size={EStyleSheet.value('$navBarIconSize')}
            color={EStyleSheet.value('$headerTintColor')}
            name="ios-calendar"
          />
        </ActionButton>
      ),
      headerTitle: title,
    };
  };

  constructor(props) {
    super(props);

    props.navigation.setParams({ calendarHandler: this.calendarClickHandler });

    this.state = {
      datesExpanded: false,
      selectedDate: null,
      selectedChannel: null,
    };
  }

  calendarClickHandler = () => {
    this.setState({
      ...this.state,
      datesExpanded: !this.state.datesExpanded,
    });
  };

  componentDidMount() {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, { screen: 'program' });
    this.props.dispatch(fetchProgram());
  }

  componentDidUpdate() {
    const { program } = this.props;
    if (this.state.selectedDate === null && program) {
      const selectedDate = program.days[0];
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ ...this.state, selectedDate });
      this.props.navigation.setParams({
        titleComponent: this.renderSelectedDayHeader(selectedDate),
      });
    }
  }

  onDaySelectedHandler = day => {
    this.setState(
      {
        ...this.state,
        selectedDate: day,
      },
      () => {
        this.calendarClickHandler();
      },
    );

    this.props.navigation.setParams({
      titleComponent: this.renderSelectedDayHeader(day),
    });
  };

  renderSelectedDayHeader = day => {
    if (day === null) {
      return <View />;
    }

    return <ProgramDay style={Styles.dayHeader} textStyle={Styles.headerText} dateString={day} />;
  };

  renderDays = () => {
    const daysComponent = this.props.program.days.map(day => {
      return (
        <TouchableOpacity onPress={() => this.onDaySelectedHandler(day)} key={day}>
          <View>
            <ProgramDay style={Styles.dayListItem} dateString={day} />
            <View style={Styles.dayListSeparator} />
          </View>
        </TouchableOpacity>
      );
    });

    return <View>{daysComponent}</View>;
  };

  renderLoading = () => {
    return <ScreenLoader />;
  };

  renderError = () => {
    //TODO implement
    return <View style={Styles.flexContainer} />;
  };

  renderChannelBar = () => {
    <View style={Styles.flexContainer}>
      <Collapsible collapsed={this.state.datesExpanded}>{this.renderDays()}</Collapsible>
    </View>;
  };

  renderProgram = () => {
    const { program } = this.props;

    const selectedDay = this.state.selectedDate || program.days[0];
    const selectedDayProgram = program[selectedDay];
    return (
      <View style={Styles.flexContainer}>
        <Collapsible collapsed={!this.state.datesExpanded}>{this.renderDays()}</Collapsible>
        <ProgramTabs program={selectedDayProgram} />
      </View>
    );
  };

  render() {
    const { screenState } = this.props;

    let content;
    switch (screenState) {
      case STATE_LOADING: {
        content = this.renderLoading();
        break;
      }
      case STATE_ERROR: {
        content = this.renderError();
        break;
      }
      case STATE_READY: {
        content = this.renderProgram();
        break;
      }
    }

    return (
      <View style={Styles.root}>
        <SafeAreaView style={Styles.flexContainer} forceInset={{ bottom: 'never' }}>
          {content}
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const prog = state.program;
  const screenState = prog.isError
    ? STATE_ERROR
    : prog.isFetching || state.program.program === null
    ? STATE_LOADING
    : STATE_READY;

  return {
    screenState,
    program: prog.program,
  };
};

export default connect(mapStateToProps)(ProgramScreen);
