import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from '../../components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from './styles';

import Gemius from 'react-native-gemius-plugin';
import GallerySwiper from 'react-native-gallery-swiper';
import { GEMIUS_VIEW_SCRIPT_ID } from '../../constants';
import { buildArticleImageUri, IMG_SIZE_XXL } from '../../util/ImageUtil';
import { BorderlessButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';

class GalleryScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    const selectedImage = this.props.navigation.getParam('selectedImage', null);
    let initialIndex = 0;
    if (selectedImage) {
      initialIndex = this.getImages().findIndex(img => img.path === selectedImage.path);
      initialIndex = Math.max(0, initialIndex);
    }

    this.state = { index: initialIndex, initialIndex };
  }

  componentDidMount() {
    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, { screen: 'gallery' });
  }

  handleImageSelected = index => {
    this.setState({ ...this.state, index });
  };

  getImages = () => this.props.navigation.getParam('images', []);

  renderDetails = () => {
    const images = this.getImages();
    const image = images[this.state.index];

    return (
      <View style={Styles.detailsContainer}>
        <View style={Styles.row}>
          <View>
            <Text style={Styles.authorText}>{image.author}</Text>
            <Text style={Styles.title}>{image.title}</Text>
          </View>
          <Text style={Styles.authorText}>
            {this.state.index + 1} / {images.length}
          </Text>
        </View>
      </View>
    );
  };

  renderExitButton = () => {
    return (
      <SafeAreaView style={Styles.absoluteLayout}>
        <View style={Styles.backButtonContainer}>
          <BorderlessButton onPress={() => this.props.navigation.goBack()}>
            <Icon name="close" color={EStyleSheet.value('$headerTintColor')} size={32} />
          </BorderlessButton>
        </View>
      </SafeAreaView>
    );
  };

  render() {
    const images = this.getImages().map(img => ({
      uri: buildArticleImageUri(IMG_SIZE_XXL, img.path),
    }));

    return (
      <View style={Styles.container}>
        <StatusBar />
        <GallerySwiper
          style={Styles.gallerySwiper}
          images={images}
          sensitiveScroll={false}
          initialNumToRender={2}
          //initialPage={this.state.initialIndex}
          pageMargin={4}
          onPageSelected={this.handleImageSelected}
        />
        {this.renderDetails()}
        {this.renderExitButton()}
      </View>
    );
  }
}

export default GalleryScreen;
