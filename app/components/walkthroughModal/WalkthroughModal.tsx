import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../Theme';
import Text from '../text/Text';
import PagerView from 'react-native-pager-view';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import WalkthroughDots from './WalkthroughDots';
import {Page1, Page2, Page3, Page4} from './WalkthroughPages';
import {useAuth0} from 'react-native-auth0';

const PAGE_COUNT = 4;

const MODAL_HEIGHT = Math.min(525, Dimensions.get('window').height * 0.8);
const MODAL_WIDTH = Math.min(360, Dimensions.get('window').width - 32);

interface WalkthroughModalProps {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const WalkthroughModal: React.FC<WalkthroughModalProps> = ({visible, onClose, onLogin}) => {
  const {user} = useAuth0();
  const [pageIndex, setPageIndex] = useState<number>(0);

  const pagerRef = useRef<PagerView>(null);
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  const increment = useCallback(() => {
    if (pageIndex === PAGE_COUNT - 1) {
      onLogin();
    } else {
      setPageIndex(Math.min(pageIndex + 1, PAGE_COUNT - 1));
    }
  }, [pageIndex, onLogin]);

  const decrement = useCallback(() => {
    setPageIndex(Math.max(pageIndex - 1, 0));
  }, [pageIndex]);

  useEffect(() => {
    pagerRef?.current?.setPage(pageIndex);
  }, [pageIndex]);

  return (
    <Modal
      accessible={false}
      style={{
        ...styles.modal,
        marginTop: insets.top + 32,
        marginLeft: insets.left + 16,
        marginRight: insets.right + 16,
        marginBottom: insets.bottom + 32,
        alignItems: 'center',
      }}
      isVisible={visible}
      useNativeDriver={false}
      coverScreen={true}
      backdropOpacity={0.7}
      onBackButtonPress={onClose}>
      <View
        style={[
          {width: MODAL_WIDTH, backgroundColor: colors.background, borderRadius: 16, overflow: 'hidden'},
        ]}>
        <View
          style={{
            height: 46,
            paddingHorizontal: 16,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{alignItems: 'flex-end'}}>
            <TouchableDebounce
              onPress={() => onClose()}
              accessibilityLabel="Uždaryti"
              accessibilityHint="Uždaryti dialogo langą"
              accessibilityLanguage="lt">
              <View style={{justifyContent: 'flex-start'}}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}>
                  {'Uždaryti'}
                </Text>
              </View>
            </TouchableDebounce>
          </View>
        </View>

        <PagerView
          ref={pagerRef}
          style={{height: MODAL_HEIGHT}}
          initialPage={pageIndex}
          scrollEnabled={true}
          onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}>
          <Page1 key="1" />
          <Page2 key="2" />
          <Page3 key="3" />
          <Page4 key="4" />
        </PagerView>
        <View
          style={{
            height: 48,
            paddingHorizontal: 16,
            backgroundColor: colors.greyBackground,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{width: 100, alignItems: 'flex-start'}}>
            <TouchableDebounce onPress={decrement} disabled={pageIndex === 0}>
              <View>
                <Text
                  style={[
                    styles.buttonText,
                    {color: pageIndex === 0 ? 'transparent' : colors.textSecondary},
                  ]}>
                  {'Grįžti'}
                </Text>
              </View>
            </TouchableDebounce>
          </View>

          <WalkthroughDots count={PAGE_COUNT} currentIndex={pageIndex} />

          <View style={{width: 100, alignItems: 'flex-end'}}>
            {pageIndex === PAGE_COUNT - 1 ? (
              <TouchableDebounce
                onPress={user ? onClose : increment}
                accessibilityLabel={user ? 'Prisijungti' : 'Uždaryti'}
                accessibilityHint={user ? 'Prisijungti prie paskyros' : 'Uždaryti dialogo langą'}>
                <View style={[styles.loginButton, {backgroundColor: 'black'}]}>
                  <Text style={[styles.buttonText, {color: 'white'}]} numberOfLines={1}>
                    {user ? 'Uždaryti' : 'Prisijungti'}
                  </Text>
                </View>
              </TouchableDebounce>
            ) : (
              <TouchableDebounce
                onPress={increment}
                accessibilityLabel="Toliau"
                accessibilityHint="Eiti į kitą puslapį">
                <View style={{justifyContent: 'flex-start'}}>
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: colors.tertiary,
                      },
                    ]}>
                    {'Kitas'}
                  </Text>
                </View>
              </TouchableDebounce>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WalkthroughModal;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  modal: {
    flex: 1,
    margin: 0,
  },
  buttonText: {
    fontSize: 16,
  },
  loginButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
});
