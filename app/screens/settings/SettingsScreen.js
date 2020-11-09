import React from 'react';
import {View, Text} from 'react-native';
import {ScalableText, SettingsToggleButton, BackIcon} from '../../components';
import {SunIcon, MoonIcon, PhotoIcon} from '../../components/svg';
import EStyleSheet from 'react-native-extended-stylesheet';
import Styles from './styles';
import {connect} from 'react-redux';
import {setConfig} from '../../redux/actions';
import {withOrientation} from 'react-navigation';
import {initTheme} from '../../ColorTheme';
import {BorderlessButton} from 'react-native-gesture-handler';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import {isEqual} from 'lodash';
import {StackActions, NavigationActions} from 'react-navigation';
import Gemius from 'react-native-gemius-plugin';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';

const TEXT_SIZE_NORMAL = 0;
const TEXT_SIZE_LARGE = 2;
const TEXT_SIZE_EXTRALARGE = 4;

const IMAGE_QUALITY_NORMAL = -0.1;
const IMAGE_QUALITY_HIGH = -0.5;
const IMAGE_QUALITY_EXTRA_HIGH = -1;

class SettingsScreen extends React.Component {
  static navigationOptions = (navigationProps) => {
    return {
      title: EStyleSheet.value('$settings'),
      headerLeft: (
        <BorderlessButton
          onPress={() => {
            const {params} = navigationProps.navigation.state;
            if (params && params.backHandler) {
              params.backHandler();
            }
          }}
          rippleColor={EStyleSheet.value('$rippleColor')}>
          <View style={Styles.backButtonContainer}>
            <BackIcon
              size={EStyleSheet.value('$navBarIconSize') + 4}
              color={EStyleSheet.value('$headerTintColor')}
            />
          </View>
        </BorderlessButton>
      ),
    };
  };

  constructor(props) {
    super(props);

    props.navigation.setParams({backHandler: this.goBack});

    if (!this.initialConfig) {
      this.initialConfig = {...props.config};
    }

    this.state = {
      config: {...props.config},
    };
  }

  componentDidMount() {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {screen: 'settings'});
  }

  onBackButtonPressAndroid = () => {
    this.goBack();
    return true;
  };

  updateStyle = (key, value) => {
    let config = this.state.config;
    config[key] = value;
    initTheme(config);
    this.setState({config});
  };

  handleSetDarkMode = (value) => {
    this.updateStyle('isDarkMode', value);
  };

  handleSetTextSize = (value) => {
    this.updateStyle('textSizeMultiplier', value);
  };

  handleSetImageMaxScaleFactor = (value) => {
    this.updateStyle('imageMaxScaleFactor', value);
  };

  goBack = () => {
    console.log('goBack() - called');
    this.save();
    this.navigateToHome();
  };

  navigateToHome = () => {
    const hasChanges = this.hasChanges();
    if (hasChanges) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'home'})],
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      this.props.navigation.dispatch(StackActions.popToTop());
    }
  };

  save = () => {
    this.props.dispatch(setConfig(this.state.config));
  };

  hasChanges = () => {
    return !isEqual(this.initialConfig, this.state.config);
  };

  render() {
    const {isDarkMode, textSizeMultiplier, imageMaxScaleFactor} = this.state.config;

    return (
      <View style={Styles.root}>
        <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
          <View style={Styles.content}>
            <View style={this.props.isLandscape === false ? Styles.controls : Styles.controlsLand}>
              <ScalableText style={Styles.title}>{EStyleSheet.value('$nightModeTitle')}</ScalableText>
              <View style={Styles.buttonContainer}>
                <SettingsToggleButton
                  style={Styles.toggleButton}
                  selected={!isDarkMode}
                  onPress={() => this.handleSetDarkMode(false)}>
                  <SunIcon size={20} selected={!isDarkMode} />
                </SettingsToggleButton>
                <View style={Styles.space} />
                <SettingsToggleButton
                  style={Styles.toggleButton}
                  selected={isDarkMode}
                  onPress={() => this.handleSetDarkMode(true)}>
                  <MoonIcon size={20} selected={isDarkMode} />
                </SettingsToggleButton>
              </View>

              <View style={Styles.line} />

              <ScalableText style={Styles.title}>{EStyleSheet.value('$textSizeTitle')}</ScalableText>
              <View style={Styles.buttonContainer}>
                <SettingsToggleButton
                  style={Styles.toggleButton}
                  selected={textSizeMultiplier === TEXT_SIZE_NORMAL}
                  onPress={() => this.handleSetTextSize(TEXT_SIZE_NORMAL)}>
                  <Text style={Styles.textNormal} allowFontScaling={false}>
                    aA
                  </Text>
                </SettingsToggleButton>
                <View style={Styles.space} />
                <SettingsToggleButton
                  style={Styles.toggleButton}
                  selected={textSizeMultiplier === TEXT_SIZE_LARGE}
                  onPress={() => this.handleSetTextSize(TEXT_SIZE_LARGE)}>
                  <Text style={Styles.textLarge} allowFontScaling={false}>
                    aA
                  </Text>
                </SettingsToggleButton>
                <View style={Styles.space} />
                <SettingsToggleButton
                  style={Styles.toggleButton}
                  selected={textSizeMultiplier === TEXT_SIZE_EXTRALARGE}
                  onPress={() => this.handleSetTextSize(TEXT_SIZE_EXTRALARGE)}>
                  <Text style={Styles.textExtraLarge} allowFontScaling={false}>
                    aA
                  </Text>
                </SettingsToggleButton>
              </View>

              <View style={Styles.line} />

              <ScalableText style={Styles.title}>{EStyleSheet.value('$imageQuality')}</ScalableText>
              <View style={Styles.buttonContainer}>
                <SettingsToggleButton
                  style={Styles.toggleButton}
                  selected={imageMaxScaleFactor === IMAGE_QUALITY_NORMAL}
                  onPress={() => this.handleSetImageMaxScaleFactor(IMAGE_QUALITY_NORMAL)}>
                  <PhotoIcon size={22} />
                </SettingsToggleButton>
                <View style={Styles.space} />
                <SettingsToggleButton
                  style={Styles.toggleButton}
                  selected={imageMaxScaleFactor === IMAGE_QUALITY_HIGH}
                  onPress={() => this.handleSetImageMaxScaleFactor(IMAGE_QUALITY_HIGH)}>
                  <PhotoIcon size={30} />
                </SettingsToggleButton>
                <View style={Styles.space} />
                <SettingsToggleButton
                  style={Styles.toggleButton}
                  selected={imageMaxScaleFactor === IMAGE_QUALITY_EXTRA_HIGH}
                  onPress={() => this.handleSetImageMaxScaleFactor(IMAGE_QUALITY_EXTRA_HIGH)}>
                  <PhotoIcon size={36} />
                </SettingsToggleButton>
              </View>
              <View style={Styles.line} />
            </View>
          </View>
        </AndroidBackHandler>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    config: state.config,
  };
};

export default connect(mapStateToProps)(withOrientation(SettingsScreen));
