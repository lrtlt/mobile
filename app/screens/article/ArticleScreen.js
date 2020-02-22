import React from 'react';
import { View, ScrollView, Animated, Platform } from 'react-native';
import { withCollapsible, setSafeBounceHeight } from 'react-navigation-collapsible';
import { connect } from 'react-redux';
import { saveArticle, removeArticle } from '../../redux/actions';
import { articleGet } from '../../api';
import DefaultArticle from './DefaultArticle';
import VideoArticle from './video/VideoArticle';
import AudioArticle from './audio/AudioArticle';
import EStyleSheet from 'react-native-extended-stylesheet';
import { CommentsIcon, ShareIcon, SaveIcon } from '../../components/svg';
import Share from 'react-native-share';
import Gemius from 'react-native-gemius-plugin';
import { GEMIUS_VIEW_SCRIPT_ID } from '../../constants';
import { SafeAreaView } from 'react-navigation';
import Snackbar from 'react-native-snackbar';

import { ScreenLoader, ScreenError, AdultContentWarning, ActionButton } from '../../components';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

import Styles from './styles';

const STATE_LOADING = 'loading';
const STATE_ADULT_CONTENT_WARNING = 'adult-content-warning';
const STATE_ERROR = 'error';
const STATE_READY = 'ready';

class ArticleScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <View style={Styles.row}>
          <ActionButton
            onPress={() => {
              const { params } = navigation.state;
              if (params && params.saveHandler) {
                params.saveHandler();
              }
            }}
          >
            <SaveIcon
              size={EStyleSheet.value('$navBarIconSize')}
              color={EStyleSheet.value('$headerTintColor')}
              filled={navigation.state.params.isSaved}
            />
          </ActionButton>
          <ActionButton
            onPress={() => {
              const { params } = navigation.state;
              if (params && params.commentsHandler) {
                params.commentsHandler();
              }
            }}
          >
            <CommentsIcon
              size={EStyleSheet.value('$navBarIconSize')}
              color={EStyleSheet.value('$headerTintColor')}
            />
          </ActionButton>
          <ActionButton
            onPress={() => {
              const { params } = navigation.state;
              if (params && params.shareHandler) {
                params.shareHandler();
              }
            }}
          >
            <ShareIcon
              size={EStyleSheet.value('$navBarIconSize')}
              color={EStyleSheet.value('$headerTintColor')}
            />
          </ActionButton>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);

    const { navigation } = props;
    navigation.setParams({
      saveHandler: this._saveArticlePress,
      commentsHandler: this._handleCommentsPress,
      shareHandler: this._handleSharePress,
      isSaved: props.isSaved,
    });

    this.state = {
      articleId: navigation.state.params.articleId,
      article: null,
      state: STATE_LOADING,
    };
  }

  componentDidMount() {
    setSafeBounceHeight(Platform.OS === 'ios' ? 200 : 100);

    const articleId = this.state.articleId;

    //N-18
    //const articleId = 1109283;

    //Video
    //const articleId = 1099108;

    //Audio
    //const articleId = 1099166;

    //Embeded audio
    //const articleId = 1096301;

    //Embeded video
    //const articleId = 1096902;

    //Embeded articles
    //const articleId = 1096551;

    //Embeded youtube
    //const articleId = 1101118;

    this.loadArticleById(articleId);
  }

  componentDidUpdate() {
    const { navigation } = this.props;
    const { articleId } = navigation.state.params;

    if (this.state.articleId !== articleId) {
      //Needs to be reloadad for with new article id
      this.loadArticleById(articleId);
    }
  }

  loadArticleById = articleId => {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      screen: 'article',
      articleId: articleId.toString(),
    });

    this.setState({
      ...this.state,
      articleId: articleId,
      article: null,
      state: STATE_LOADING,
    });

    this.callApi(articleId)
      .then(article => this.parseArticle(article.article))
      .catch(_ =>
        this.setState({
          ...this.state,
          article: null,
          state: STATE_ERROR,
        }),
      );
  };

  parseArticle = article => {
    const state =
      article === null ? STATE_ERROR : article['n-18'] ? STATE_ADULT_CONTENT_WARNING : STATE_READY;

    this.setState({
      ...this.state,
      isLoading: false,
      article: article,
      state,
    });
  };

  handleAcceptAdultContent = () => {
    this.setState({
      ...this.state,
      state: STATE_READY,
    });
  };

  handleDeclineAdultContent = () => {
    this.navigateBack();
  };

  navigateBack() {
    this.props.navigation.goBack();
  }

  callApi = async articleId => {
    const response = await fetch(articleGet(articleId));
    const result = await response.json();
    console.log('ARTICLE API RESPONSE', result);
    return result;
  };

  _saveArticlePress = () => {
    const { article } = this.state;
    if (!article) {
      return;
    }

    if (this.props.isSaved === true) {
      this.props.dispatch(removeArticle(article.article_id));
    } else {
      this.props.dispatch(saveArticle(article));
      Snackbar.show({
        text: EStyleSheet.value('$articleHasBeenSaved'),
        duration: Snackbar.LENGTH_SHORT,
      });
    }

    this.props.navigation.setParams({
      isSaved: !this.props.isSaved,
    });
  };

  _handleSharePress = () => {
    const { article } = this.state;
    if (!article) {
      return;
    }

    const url = 'https://lrt.lt' + (this.state.article.article_url || this.state.article.url);
    const shareOptions = {
      url,
    };
    Share.open(shareOptions);
  };

  _handleCommentsPress = () => {
    const { article } = this.state;
    if (article === null || article.article_url === null) {
      return;
    }

    const url = 'https://lrt.lt' + this.state.article.article_url;
    this.props.navigation.push('comments', { url: url });
  };

  isArticleLoaded = () => this.state.article !== null;

  renderLoading = props => (
    <View style={Styles.screen}>
      <ScreenLoader />
    </View>
  );

  renderError = props => (
    <View style={Styles.screen}>
      <ScreenError text={EStyleSheet.value('$articleError')} />
    </View>
  );

  renderAdultContentWarning = props => (
    <View style={Styles.screen}>
      <View style={Styles.centerContainer}>
        <AdultContentWarning
          onAccept={() => this.handleAcceptAdultContent()}
          onDecline={() => this.handleDeclineAdultContent()}
        />
      </View>
    </View>
  );

  renderDefaultArticle = props => (
    <DefaultArticle {...props} onItemPress={item => this._handleItemPress(item)} />
  );

  renderVideoArticle = props => <VideoArticle {...props} />;

  renderAudioArticle = props => <AudioArticle {...props} />;

  renderArticleComponent = props => {
    const { paddingHeight, animatedY, onScroll } = this.props.collapsible;
    const { article } = this.state;

    let articleComponent;
    if (article === null) {
      articleComponent = <View />;
    } else if (article.is_video === 1) {
      articleComponent = this.renderVideoArticle(this.state);
    } else if (article.is_audio === 1) {
      articleComponent = this.renderAudioArticle(this.state);
    } else {
      articleComponent = this.renderDefaultArticle(this.state);
    }

    return (
      <View style={Styles.screen}>
        <AnimatedScrollView
          style={Styles.scrollContainer}
          contentContainerStyle={{ paddingTop: paddingHeight, width: '100%' }}
          scrollIndicatorInsets={{ top: paddingHeight }}
          _mustAddThis={animatedY}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {articleComponent}
        </AnimatedScrollView>
      </View>
    );
  };

  _handleItemPress(item) {
    switch (item.type) {
      case 'photo': {
        this.props.navigation.push('gallery', {
          images: this.state.article.article_photos,
          selectedImage: item.item,
        });
        break;
      }
      case 'article': {
        this.props.navigation.push('article', { articleId: item.item.id });
        break;
      }
      default: {
        console.warn('Unkown type selected ' + item.type);
        break;
      }
    }
  }

  render() {
    const { state } = this.state;

    let content;

    switch (state) {
      case STATE_LOADING: {
        content = this.renderLoading();
        break;
      }
      case STATE_ERROR: {
        content = this.renderError();
        break;
      }
      case STATE_ADULT_CONTENT_WARNING: {
        content = this.renderAdultContentWarning();
        break;
      }
      case STATE_READY: {
        content = this.renderArticleComponent();
        break;
      }
    }

    return (
      <SafeAreaView
        style={Styles.root}
        forceInset={{
          bottom: 'never',
        }}
      >
        {content}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { savedArticles } = state.articleStorage;
  const { articleId } = ownProps.navigation.state.params;

  const isSaved = savedArticles && savedArticles.find(a => a.id == articleId) != undefined;
  return { isSaved };
};

const root = withCollapsible(ArticleScreen, {
  iOSCollapsedColor: 'transparent',
});

export default connect(mapStateToProps)(root);
