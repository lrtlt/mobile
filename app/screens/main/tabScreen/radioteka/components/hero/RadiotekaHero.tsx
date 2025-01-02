import React, {useState, useEffect} from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView} from 'react-native';
import Animated, {useAnimatedStyle, withSpring, useSharedValue} from 'react-native-reanimated';
import {Text} from '../../../../../../components';
import ThemeProvider from '../../../../../../theme/ThemeProvider';
import {themeLight} from '../../../../../../Theme';
import {IconPlay} from '../../../../../../components/svg';

const {height} = Dimensions.get('window');
const width = Math.min(Dimensions.get('window').width * 0.32, 150);

const RadiotekaHero: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const podcastItems = [
    {
      id: 1,
      title: 'LRT Aktualijų studija',
      subtitle: 'Aktualios politinės, ekonominės ir socialinės temos',
      image: 'https://placeholder.com/300x300',
      backgroundColor: '#4A1515',
    },
    {
      id: 2,
      title: 'ŠVIESI ATEITIS',
      subtitle: 'Pokalbiai apie technologijas ir inovacijas',
      image: 'https://placeholder.com/300x300',
      backgroundColor: '#1A1A3A',
    },
    {
      id: 3,
      title: 'Žaidžiam žmogų',
      subtitle: 'Psichologijos ir saviugdos laida',
      image: 'https://placeholder.com/300x300',
      backgroundColor: '#FF8C42',
    },
    {
      id: 4,
      title: 'Ryto garsai',
      subtitle: 'Rytinė muzikos ir pokalbių laida',
      image: 'https://placeholder.com/300x300',
      backgroundColor: '#2E8B57',
    },
    {
      id: 5,
      title: 'Kultūros savaitė',
      subtitle: 'Savaitės kultūros įvykių apžvalga',
      image: 'https://placeholder.com/300x300',
      backgroundColor: '#4B0082',
    },
    {
      id: 6,
      title: 'Muzikinis pastišas',
      subtitle: 'Įvairių muzikos stilių rinkinys',
      image: 'https://placeholder.com/300x300',
      backgroundColor: '#8B4513',
    },
    {
      id: 7,
      title: 'Vakaro pasaka',
      subtitle: 'Pasakos vaikams ir suaugusiems',
      image: 'https://placeholder.com/300x300',
      backgroundColor: '#483D8B',
    },
  ];

  const scaleValues = podcastItems.map(() => useSharedValue(1));

  useEffect(() => {
    // Reset all scales to 1
    scaleValues.forEach((scale, index) => {
      scale.value = withSpring(index === selectedIndex ? 1.1 : 1);
    });
  }, [selectedIndex]);

  const getAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      return {
        transform: [{scale: scaleValues[index].value}],
        borderWidth: 2,
        borderColor: index === selectedIndex ? '#FFFFFF' : 'transparent',
      };
    });
  };

  const handleItemPress = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <ThemeProvider forceTheme={themeLight}>
      <View style={[styles.container, {backgroundColor: podcastItems[selectedIndex].backgroundColor}]}>
        <View style={styles.header}>
          <Text style={styles.headerText} fontFamily="SourceSansPro-SemiBold" numberOfLines={1}>
            {podcastItems[selectedIndex].title}
          </Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.mainContentText}>
            <Text style={styles.duration}>53 min.</Text>
            <Text style={styles.title} fontFamily="PlayfairDisplay-Regular">
              {podcastItems[selectedIndex].title}
            </Text>
            <Text style={styles.subtitle}>{podcastItems[selectedIndex].subtitle}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.playButton}>
                <IconPlay size={14} />
                <Text style={styles.playButtonText}>Klausytis</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreButtonText}>Daugiau</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bottomScrollView}
            contentContainerStyle={styles.bottomList}>
            {podcastItems.map((item, index) => (
              <TouchableOpacity key={item.id} onPress={() => handleItemPress(index)}>
                <Animated.View style={[styles.thumbnailContainer, getAnimatedStyle(index)]}>
                  <Image source={{uri: item.image}} style={styles.thumbnail} />
                </Animated.View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 12,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 19,
  },
  mainContent: {
    justifyContent: 'center',
  },
  mainContentText: {
    paddingHorizontal: 12,
  },
  duration: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.8,
    alignSelf: 'flex-start',
    borderRadius: 3,
    backgroundColor: '#000000A0',
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    marginVertical: 10,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 17,
    marginBottom: 30,
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  playButton: {
    backgroundColor: '#FFD600',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  playButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  moreButton: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  moreButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  bottomScrollView: {},
  bottomList: {
    flexDirection: 'row',
    paddingVertical: 32,
    paddingHorizontal: 18,
    gap: 16,
  },
  thumbnailContainer: {
    width: width,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});

export default RadiotekaHero;
