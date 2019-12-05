import React, { Component } from 'react';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  TouchableWithoutFeedback,
  TouchableHighlight,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Animated,
  Easing,
  View,
  Text,
} from 'react-native';
import _ from 'lodash';

const iconSize = 26;

export default class VideoPlayer extends Component {
  static defaultProps = {
    playInBackground: true,
    playWhenInactive: false,
    showOnStart: true,
    resizeMode: 'contain',
    paused: false,
    repeat: false,
    mute: false,
    title: '',
    rate: 1,
  };

  constructor(props) {
    super(props);

    /**
     * All of our values that are updated by the
     * methods and listeners in this class
     */
    this.state = {
      // Video
      resizeMode: this.props.resizeMode,
      paused: this.props.paused,
      mute: this.props.mute,
      rate: this.props.rate,
      // Controls

      showTimeRemaining: true,
      lastScreenPress: 0,
      seekerFillWidth: 0,
      showControls: this.props.showOnStart,
      seekerPosition: 0,
      seekerOffset: 0,
      seeking: false,
      loading: false,
      currentTime: 0,
      error: false,
      duration: 0,
    };

    /**
     * Any options that can be set at init.
     */
    this.opts = {
      playWhenInactive: this.props.playWhenInactive,
      playInBackground: this.props.playInBackground,
      repeat: this.props.repeat,
      title: this.props.title,
    };

    /**
     * Our app listeners and associated methods
     */
    this.events = {
      onError: this.props.onError || this._onError.bind(this),
      onEnd: this.props.onEnd || this._onEnd.bind(this),
      onLoadStart: this._onLoadStart.bind(this),
      onProgress: this._onProgress.bind(this),
      onLoad: this._onLoad.bind(this),
      onPause: this.props.onPause,
      onPlay: this.props.onPlay,
    };

    /**
     * Functions used throughout the application
     */
    this.methods = {
      togglePlayPause: this._togglePlayPause.bind(this),
      toggleMute: this._toggleMute.bind(this),
      toggleControls: this._toggleControls.bind(this),
      toggleTimer: this._toggleTimer.bind(this),
    };

    /**
     * Player information
     */
    this.player = {
      controlTimeoutDelay: this.props.controlTimeout || 15000,
      seekPanResponder: PanResponder,
      controlTimeout: null,
      iconOffset: 7,
      seekWidth: 0,
      ref: Video,
    };

    /**
     * Various animations
     */
    const initialValue = this.props.showOnStart ? 1 : 0;

    this.animations = {
      bottomControl: {
        marginBottom: new Animated.Value(0),
        opacity: new Animated.Value(initialValue),
      },
      topControl: {
        marginTop: new Animated.Value(0),
        opacity: new Animated.Value(initialValue),
      },
      video: {
        opacity: new Animated.Value(1),
      },
      loader: {
        rotate: new Animated.Value(0),
        MAX_VALUE: 360,
      },
    };

    /**
     * Various styles that be added...
     */
    this.styles = {
      videoStyle: this.props.videoStyle || {},
      containerStyle: this.props.style || {},
    };
  }

  /**
    | -------------------------------------------------------
    | Events
    | -------------------------------------------------------
    |
    | These are the events that the <Video> component uses
    | and can be overridden by assigning it as a prop.
    | It is suggested that you override onEnd.
    |
    */

  /**
   * When load starts we display a loading icon
   * and show the controls.
   */
  _onLoadStart() {
    let state = this.state;
    state.loading = true;
    this.loadAnimation();
    this.setState(state);

    if (typeof this.props.onLoadStart === 'function') {
      this.props.onLoadStart(...arguments);
    }
  }

  /**
   * When load is finished we hide the load icon
   * and hide the controls. We also set the
   * video duration.
   *
   * @param {object} data The video meta data
   */
  _onLoad(data = {}) {
    let state = this.state;

    state.duration = data.duration;
    state.loading = false;
    this.setState(state);

    if (state.showControls) {
      this.setControlTimeout();
    }

    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad(...arguments);
    }
  }

  /**
   * For onprogress we fire listeners that
   * update our seekbar and timer.
   *
   * @param {object} data The video meta data
   */
  _onProgress(data = {}) {
    let state = this.state;
    state.currentTime = data.currentTime;

    if (!state.seeking) {
      const position = this.calculateSeekerPosition();
      this.setSeekerPosition(position);
    }

    if (typeof this.props.onProgress === 'function') {
      this.props.onProgress(...arguments);
    }

    this.setState(state);
  }

  /**
   * It is suggested that you override this
   * command so your app knows what to do.
   * Either close the video or go to a
   * new page.
   */
  _onEnd() {}

  /**
   * Set the error state to true which then
   * changes our renderError function
   *
   * @param {object} err  Err obj returned from <Video> component
   */
  _onError(err) {
    let state = this.state;
    state.error = true;
    state.loading = false;

    this.setState(state);
  }

  /**
    | -------------------------------------------------------
    | Methods
    | -------------------------------------------------------
    |
    | These are all of our functions that interact with
    | various parts of the class. Anything from
    | calculating time remaining in a video
    | to handling control operations.
    |
    */

  /**
   * Set a timeout when the controls are shown
   * that hides them after a length of time.
   * Default is 15s
   */
  setControlTimeout() {
    this.player.controlTimeout = setTimeout(() => {
      this._hideControls();
    }, this.player.controlTimeoutDelay);
  }

  /**
   * Clear the hide controls timeout.
   */
  clearControlTimeout() {
    clearTimeout(this.player.controlTimeout);
  }

  /**
   * Reset the timer completely
   */
  resetControlTimeout() {
    this.clearControlTimeout();
    this.setControlTimeout();
  }

  /**
   * Animation to hide controls. We fade the
   * display to 0 then move them off the
   * screen so they're not interactable
   */
  hideControlAnimation() {
    Animated.parallel([
      Animated.timing(this.animations.topControl.opacity, { toValue: 0 }),
      Animated.timing(this.animations.topControl.marginTop, { toValue: -100 }),
      Animated.timing(this.animations.bottomControl.opacity, { toValue: 0 }),
      Animated.timing(this.animations.bottomControl.marginBottom, {
        toValue: -100,
      }),
    ]).start();
  }

  /**
   * Animation to show controls...opposite of
   * above...move onto the screen and then
   * fade in.
   */
  showControlAnimation() {
    Animated.parallel([
      Animated.timing(this.animations.topControl.opacity, { toValue: 1 }),
      Animated.timing(this.animations.topControl.marginTop, { toValue: 0 }),
      Animated.timing(this.animations.bottomControl.opacity, { toValue: 1 }),
      Animated.timing(this.animations.bottomControl.marginBottom, {
        toValue: 0,
      }),
    ]).start();
  }

  /**
   * Loop animation to spin loader icon. If not loading then stop loop.
   */
  loadAnimation() {
    if (this.state.loading) {
      Animated.sequence([
        Animated.timing(this.animations.loader.rotate, {
          toValue: this.animations.loader.MAX_VALUE,
          duration: 1500,
          easing: Easing.linear,
        }),
        Animated.timing(this.animations.loader.rotate, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
        }),
      ]).start(this.loadAnimation.bind(this));
    }
  }

  /**
   * Function to hide the controls. Sets our
   * state then calls the animation.
   */
  _hideControls() {
    if (this.mounted) {
      let state = this.state;
      state.showControls = false;
      this.hideControlAnimation();

      this.setState(state);
    }
  }

  /**
   * Function to toggle controls based on
   * current state.
   */
  _toggleControls() {
    let state = this.state;
    state.showControls = !state.showControls;

    if (state.showControls) {
      this.showControlAnimation();
      this.setControlTimeout();
    } else {
      this.hideControlAnimation();
      this.clearControlTimeout();
    }

    this.setState(state);
  }

  /**
   * Toggle playing state on <Video> component
   */
  _togglePlayPause() {
    let state = this.state;
    state.paused = !state.paused;

    if (state.paused) {
      typeof this.events.onPause === 'function' && this.events.onPause();
    } else {
      typeof this.events.onPlay === 'function' && this.events.onPlay();
    }

    this.setState(state);
  }

  _toggleMute() {
    let state = this.state;
    state.mute = !state.mute;
    this.setState(state);
  }

  /**
   * Toggle between showing time remaining or
   * video duration in the timer control
   */
  _toggleTimer() {
    let state = this.state;
    state.showTimeRemaining = !state.showTimeRemaining;
    this.setState(state);
  }

  /**
   * Calculate the time to show in the timer area
   * based on if they want to see time remaining
   * or duration. Formatted to look as 00:00.
   */
  calculateTime() {
    if (this.state.showTimeRemaining) {
      const time = this.state.duration - this.state.currentTime;
      return `-${this.formatTime(time)}`;
    }

    return this.formatTime(this.state.currentTime);
  }

  /**
   * Format a time string as mm:ss
   *
   * @param {int} time time in milliseconds
   * @return {string} formatted time string in mm:ss format
   */
  formatTime(time = 0) {
    const symbol = this.state.showRemainingTime ? '-' : '';
    time = Math.min(Math.max(time, 0), this.state.duration);

    const formattedMinutes = _.padStart(Math.floor(time / 60).toFixed(0), 2, 0);
    const formattedSeconds = _.padStart(Math.floor(time % 60).toFixed(0), 2, 0);

    return `${symbol}${formattedMinutes}:${formattedSeconds}`;
  }

  /**
   * Set the position of the seekbar's components
   * (both fill and handle) according to the
   * position supplied.
   *
   * @param {float} position position in px of seeker handle}
   */
  setSeekerPosition(position = 0) {
    let state = this.state;
    position = this.constrainToSeekerMinMax(position);

    state.seekerFillWidth = position;
    state.seekerPosition = position;

    if (!state.seeking) {
      state.seekerOffset = position;
    }

    this.setState(state);
  }

  /**
   * Contrain the location of the seeker to the
   * min/max value based on how big the
   * seeker is.
   *
   * @param {float} val position of seeker handle in px
   * @return {float} contrained position of seeker handle in px
   */
  constrainToSeekerMinMax(val = 0) {
    if (val <= 0) {
      return 0;
    } else if (val >= this.player.seekerWidth) {
      return this.player.seekerWidth;
    }
    return val;
  }

  /**
   * Calculate the position that the seeker should be
   * at along its track.
   *
   * @return {float} position of seeker handle in px based on currentTime
   */
  calculateSeekerPosition() {
    const percent = this.state.currentTime / this.state.duration;
    return this.player.seekerWidth * percent;
  }

  /**
   * Return the time that the video should be at
   * based on where the seeker handle is.
   *
   * @return {float} time in ms based on seekerPosition.
   */
  calculateTimeFromSeekerPosition() {
    const percent = this.state.seekerPosition / this.player.seekerWidth;
    return this.state.duration * percent;
  }

  /**
   * Seek to a time in the video.
   *
   * @param {float} time time to seek to in ms
   */
  seekTo(time = 0) {
    let state = this.state;
    state.currentTime = time;
    this.player.ref.seek(time);
    this.setState(state);
  }

  /**
    | -------------------------------------------------------
    | React Component functions
    | -------------------------------------------------------
    |
    | Here we're initializing our listeners and getting
    | the component ready using the built-in React
    | Component methods
    |
    */

  // /**
  //  * To allow basic playback management from the outside
  //  * we have to handle possible props changes to state changes
  //  */
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (this.state.paused !== nextProps.paused) {
  //     this.setState({
  //       paused: nextProps.paused,
  //     });
  //   }
  // }

  componentDidMount() {
    this.initSeekPanResponder();
    this.mounted = true;
  }

  /**
   * When the component is about to unmount kill the
   * timeout less it fire in the prev/next scene
   */
  componentWillUnmount() {
    this.mounted = false;
    this.clearControlTimeout();
  }

  /**
   * Get our seekbar responder going
   */
  initSeekPanResponder() {
    this.player.seekPanResponder = PanResponder.create({
      // Ask to be the responder.
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      /**
       * When we start the pan tell the machine that we're
       * seeking. This stops it from updating the seekbar
       * position in the onProgress listener.
       */
      onPanResponderGrant: (evt, gestureState) => {
        let state = this.state;
        this.clearControlTimeout();
        state.seeking = true;
        this.setState(state);
      },

      /**
       * When panning, update the seekbar position, duh.
       */
      onPanResponderMove: (evt, gestureState) => {
        const position = this.state.seekerOffset + gestureState.dx;
        this.setSeekerPosition(position);
      },

      /**
       * On release we update the time and seek to it in the video.
       * If you seek to the end of the video we fire the
       * onEnd callback
       */
      onPanResponderRelease: (evt, gestureState) => {
        const time = this.calculateTimeFromSeekerPosition();
        let state = this.state;
        if (time >= state.duration && !state.loading) {
          state.paused = true;
          this.events.onEnd();
        } else {
          this.seekTo(time);
          this.setControlTimeout();
          state.seeking = false;
        }
        this.setState(state);
      },
    });
  }

  /**
    | -------------------------------------------------------
    | Rendering
    | -------------------------------------------------------
    |
    | This section contains all of our render methods.
    | In addition to the typical React render func
    | we also have all the render methods for
    | the controls.
    |
    */

  /**
   * Standard render control function that handles
   * everything except the sliders. Adds a
   * consistent <TouchableHighlight>
   * wrapper and styling.
   */
  renderControl(children, callback, style = {}) {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        activeOpacity={0.3}
        onPress={() => {
          this.resetControlTimeout();
          callback();
        }}
        style={[styles.controls.control, style]}
      >
        {children}
      </TouchableHighlight>
    );
  }

  /**
   * Renders an empty control, used to disable a control without breaking the view layout.
   */
  renderNullControl() {
    return <View style={[styles.controls.control]} />;
  }

  /**
   * Groups the top bar controls together in an animated
   * view and spaces them out.
   */
  renderTopControls() {
    return (
      <Animated.View
        style={[
          styles.controls.top,
          {
            opacity: this.animations.topControl.opacity,
            marginTop: this.animations.topControl.marginTop,
          },
        ]}
      />
    );
  }

  /**
   * Render bottom control group and wrap it in a holder
   */
  renderBottomControls() {
    const timerControl = this.props.disableTimer ? this.renderNullControl() : this.renderTimer();
    const seekbarControl = this.props.disableSeekbar ? this.renderNullControl() : this.renderSeekbar();
    const playPauseControl = this.props.disablePlayPause ? this.renderNullControl() : this.renderPlayPause();

    const soundControl = this.renderSoundControl();

    return (
      <Animated.View
        style={[
          styles.controls.bottom,
          {
            opacity: this.animations.bottomControl.opacity,
            marginBottom: this.animations.bottomControl.marginBottom,
          },
        ]}
      >
        <ImageBackground
          //source={require('./assets/img/bottom-vignette.png')}
          style={[styles.controls.column]}
          imageStyle={[styles.controls.vignette]}
        >
          {seekbarControl}
          <View style={[styles.controls.row, styles.controls.bottomControlGroup]}>
            {playPauseControl}
            {soundControl}
            {this.renderTitle()}
            {timerControl}
          </View>
        </ImageBackground>
      </Animated.View>
    );
  }

  /**
   * Render the seekbar and attach its handlers
   */
  renderSeekbar() {
    return (
      <View style={styles.seekbar.container}>
        <View
          style={styles.seekbar.track}
          onLayout={event => (this.player.seekerWidth = event.nativeEvent.layout.width)}
        >
          <View
            style={[
              styles.seekbar.fill,
              {
                width: this.state.seekerFillWidth,
                backgroundColor: this.props.seekColor || '#FFF',
              },
            ]}
          />
        </View>
        <View
          style={[styles.seekbar.handle, { left: this.state.seekerPosition }]}
          {...this.player.seekPanResponder.panHandlers}
        >
          <View style={[styles.seekbar.circle, { backgroundColor: this.props.seekColor || '#FFF' }]} />
        </View>
      </View>
    );
  }

  /**
   * Render the play/pause button and show the respective icon
   */
  renderPlayPause() {
    let iconName = this.state.paused === true ? 'play-arrow' : 'pause';
    return this.renderControl(
      <Icon name={iconName} color="white" size={iconSize} />,
      this.methods.togglePlayPause,
      styles.controls.playPause,
    );
  }

  /**
   * Render the play/pause button and show the respective icon
   */
  renderSoundControl() {
    let iconName = this.state.mute === true ? 'volume-off' : 'volume-up';
    return this.renderControl(
      <Icon name={iconName} color="white" size={iconSize} />,
      this.methods.toggleMute,
      styles.controls.playPause,
    );
  }

  /**
   * Render our title...if supplied.
   */
  renderTitle() {
    if (this.opts.title) {
      return (
        <View style={[styles.controls.control, styles.controls.title]}>
          <Text style={[styles.controls.text, styles.controls.titleText]} numberOfLines={1}>
            {this.opts.title || ''}
          </Text>
        </View>
      );
    }

    return null;
  }

  /**
   * Show our timer.
   */
  renderTimer() {
    return this.renderControl(
      <Text style={styles.controls.timerText}>{this.calculateTime()}</Text>,
      this.methods.toggleTimer,
      styles.controls.timer,
    );
  }

  /**
   * Show loading icon
   */
  renderLoader() {
    if (this.state.loading) {
      return (
        <View style={styles.loader.container}>
          <Animated.View
            style={[
              styles.loader.icon,
              {
                transform: [
                  {
                    rotate: this.animations.loader.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Icon name="crop-square" color="white" size={iconSize} />
          </Animated.View>
        </View>
      );
    }
    return null;
  }

  renderError() {
    if (this.state.error) {
      return (
        <View style={styles.error.container}>
          <Icon name="error" color="#d15549" size={iconSize} />
          <Text style={styles.error.text}>Audio unavailable</Text>
        </View>
      );
    }
    return null;
  }

  /**
   * Provide all of our options and render the whole component.
   */
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.events.onScreenTouch}
        style={[styles.player.container, this.styles.containerStyle]}
      >
        <View style={[styles.player.container, this.styles.containerStyle]}>
          <Video
            {...this.props}
            ref={videoPlayer => (this.player.ref = videoPlayer)}
            resizeMode={this.state.resizeMode}
            paused={this.state.paused}
            muted={this.state.mute}
            rate={this.state.rate}
            onLoadStart={this.events.onLoadStart}
            onProgress={this.events.onProgress}
            ignoreSilentSwitch={'ignore'}
            onError={this.events.onError}
            audioOnly={true}
            onLoad={this.events.onLoad}
            onEnd={this.events.onEnd}
            style={[styles.player.video, this.styles.videoStyle]}
            source={this.props.source}
          />
          {this.renderError()}
          {this.renderTopControls()}
          {this.renderLoader()}
          {this.renderBottomControls()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

/**
 * This object houses our styles. There's player
 * specific styles and control specific ones.
 * And then there's volume/seeker styles.
 */
const styles = {
  player: StyleSheet.create({
    container: {
      paddingTop: 24,
      backgroundColor: '#222',
      borderRadius: 4,
      flex: 1,

      alignSelf: 'stretch',
      justifyContent: 'space-between',
    },
    video: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }),
  error: StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingEnd: 12,
    },
    icon: {},
    text: {
      color: 'white',
      paddingStart: 12,
    },
  }),
  loader: StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
  controls: StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    column: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    vignette: {
      resizeMode: 'stretch',
    },
    control: {
      padding: 8,
    },
    text: {
      backgroundColor: 'transparent',
      color: '#FFF',
      fontSize: 14,
      textAlign: 'center',
    },
    pullRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    top: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
    bottom: {
      alignItems: 'stretch',
      flex: 2,
      justifyContent: 'flex-end',
    },
    topControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      width: null,
      marginTop: 16,
      marginBottom: 12,
      padding: 12,
    },
    bottomControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    playPause: {
      zIndex: 0,
    },
    title: {
      alignItems: 'center',
      flex: 0.6,
      flexDirection: 'column',
      padding: 0,
    },
    titleText: {
      textAlign: 'center',
    },
    timer: { flex: 1 },
    timerText: {
      backgroundColor: 'transparent',
      color: '#FFF',
      fontSize: 12,
      paddingEnd: 8,
      textAlign: 'right',
    },
  }),
  seekbar: StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      height: 24,
      marginLeft: 14,
      marginRight: 14,
    },
    track: {
      backgroundColor: '#999',
      height: 2,
      position: 'relative',
      top: 14,
      width: '100%',
    },
    fill: {
      backgroundColor: '#FFF',
      height: 2,
      width: '100%',
    },
    handle: {
      position: 'absolute',
      marginLeft: -7,
      height: 28,
      width: 28,
    },
    circle: {
      borderRadius: 12,
      position: 'relative',
      top: 7,
      left: 6,
      height: 16,
      width: 16,
    },
  }),
};
