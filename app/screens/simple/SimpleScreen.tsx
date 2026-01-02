import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SafeAreaView} from 'react-native-safe-area-context';
import SimpleArticleScreen from '../main/tabScreen/simple/SimpleArticleScreen';
import {MENU_TYPE_CATEGORY} from '../../api/Types';
import ThemeProvider from '../../theme/ThemeProvider';
import {useTheme} from '../../Theme';
import SimpleDisclaimer from '../article/simpleFooter/SimpleDisclaimer';
import {SIMPLIFIED_CATEGORY_ID} from '../../constants';
import useCategoryScreenAnalytics from '../main/tabScreen/category/useCategoryScreenAnalytics';

type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Simple'>;

type Props = {
  navigation: ScreenNavigationProp;
};

const categoryInfo = {
  categoryId: SIMPLIFIED_CATEGORY_ID,
  categoryTitle: 'LRT paprastai',
  categoryUrl: 'https://www.lrt.lt/naujienos/lrt-paprastai',
};

const SimpleScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const theme = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: categoryInfo.categoryTitle,
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: '400',
      },
    });
  }, [navigation]);

  useCategoryScreenAnalytics({
    categoryUrl: categoryInfo.categoryUrl,
    categoryTitle: categoryInfo.categoryTitle,
  });

  return (
    <ThemeProvider forceTheme={{...theme, simplyfied: true}}>
      <SafeAreaView style={styles.screen} edges={['left', 'right']}>
        <SimpleArticleScreen
          type={MENU_TYPE_CATEGORY}
          showTitle={false}
          categoryId={categoryInfo.categoryId}
          categoryTitle={categoryInfo.categoryTitle}
          categoryUrl={categoryInfo.categoryUrl}
          headerComponent={
            <View style={styles.headerContainer}>
              <SimpleDisclaimer />
            </View>
          }
        />
      </SafeAreaView>
    </ThemeProvider>
  );
};

export default SimpleScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerContainer: {
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
});
