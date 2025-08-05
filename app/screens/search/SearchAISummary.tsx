import {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import Reanimated, {CurvedTransition, FadeIn} from 'react-native-reanimated';
import {useTheme} from '../../Theme';
import {Text} from '../../components';
import {IconGeminy} from '../../components/svg';
import GradientShimmer from 'react-native-gradient-shimmer';
import LinearGradient from 'react-native-linear-gradient';
import Divider from '../../components/divider/Divider';

interface Props {
  isLoading: boolean;
  summary?: string;
}

const SearchAISummary: React.FC<PropsWithChildren<Props>> = ({isLoading, summary}) => {
  const {colors, dim} = useTheme();

  const shimmerWidths = [30, 50, 80, 100, 120];

  const getRandomShimmerComponents = () => {
    const componentCount = Math.floor(Math.random() * 10) + 25;
    return Array.from({length: componentCount}, (_, index) => {
      const randomWidth = shimmerWidths[Math.floor(Math.random() * shimmerWidths.length)];
      return (
        <Reanimated.View key={`shimmer-${index}`} entering={FadeIn.duration(300).delay(index * 40)}>
          <GradientShimmer
            key={index}
            LinearGradientComponent={LinearGradient}
            height={12}
            width={randomWidth}
          />
        </Reanimated.View>
      );
    });
  };

  const LoadingComponent = (
    <Reanimated.View
      layout={CurvedTransition.duration(400)}
      entering={FadeIn.duration(200).delay(200)}
      style={{
        ...styles.summaryContainer,
        backgroundColor: colors.slugBackground,
        borderColor: colors.border,
      }}>
      <View style={{...styles.row, gap: 8, alignItems: 'center'}}>
        <GradientShimmer
          LinearGradientComponent={LinearGradient}
          height={dim.appBarIconSize}
          width={dim.appBarIconSize}
          style={{borderRadius: dim.appBarIconSize / 2}}
        />
        <GradientShimmer
          LinearGradientComponent={LinearGradient}
          height={styles.summaryText.fontSize}
          width={240}
        />
      </View>
      <View style={{...styles.row, gap: 8, paddingTop: 12, flexWrap: 'wrap'}}>
        {getRandomShimmerComponents()}
      </View>
    </Reanimated.View>
  );

  const SummaryComponent = (
    <Reanimated.View
      entering={FadeIn.duration(300).delay(200)}
      layout={CurvedTransition.duration(400)}
      style={{
        ...styles.summaryContainer,
        backgroundColor: colors.slugBackground,
        borderColor: colors.border,
      }}>
      <View style={{...styles.row, gap: 8, alignItems: 'center'}}>
        <IconGeminy size={dim.appBarIconSize} color={colors.tertiary} />
        <Text style={{color: colors.primaryDark, fontSize: 20}} fontFamily="SourceSansPro-SemiBold">
          DI Santrauka
        </Text>
      </View>
      <Text style={{...styles.summaryText}}>{summary}</Text>
      <Divider />
      <Text type="secondary" style={{fontSize: 15}}>
        Dirbtinio intelekto sukurti rezultatai gali būti netikslūs. Visada patikrinkite svarbią informaciją.
      </Text>
    </Reanimated.View>
  );

  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 0,
      }}>
      {isLoading ? LoadingComponent : SummaryComponent}
    </View>
  );
};

export default SearchAISummary;

const styles = StyleSheet.create({
  summaryContainer: {
    gap: 8,
    borderRadius: 8,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
  },
  summaryText: {
    flex: 1,
    fontSize: 19,
    lineHeight: 26,
  },
});
