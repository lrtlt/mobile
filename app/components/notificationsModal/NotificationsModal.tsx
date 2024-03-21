import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../Theme';
import Text from '../text/Text';
import PagerView from 'react-native-pager-view';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import PagerDots from './Dots';
import {Page1, Page2, Page3} from './Pages';

const PAGE_COUNT = 3;

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({visible, onClose}) => {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const pagerRef = React.useRef<PagerView>(null);
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  const increment = useCallback(() => {
    if (pageIndex === PAGE_COUNT - 1) {
      onClose();
    } else {
      setPageIndex(Math.min(pageIndex + 1, PAGE_COUNT - 1));
    }
  }, [pageIndex]);

  const decrement = useCallback(() => {
    setPageIndex(Math.max(pageIndex - 1, 0));
  }, [pageIndex]);

  useEffect(() => {
    pagerRef?.current?.setPage(pageIndex);
    const t = setInterval(() => {
      pagerRef?.current?.setPage(pageIndex);
      clearInterval(t);
    }, 500);
    return () => {
      clearInterval(t);
    };
  }, [pageIndex]);

  return (
    <Modal
      style={{
        ...styles.modal,
        // backgroundColor: colors.slugBackground,
        marginTop: insets.top + 32,
        marginLeft: insets.left + 16,
        marginRight: insets.right + 16,
        marginBottom: insets.bottom + 32,
      }}
      isVisible={visible}
      useNativeDriver={false}
      coverScreen={true}
      backdropOpacity={0.7}
      onBackButtonPress={onClose}>
      <View style={[styles.flex, {backgroundColor: colors.background, borderRadius: 12, overflow: 'hidden'}]}>
        <View
          style={{
            height: 52,
            paddingHorizontal: 16,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{alignItems: 'flex-end'}}>
            <TouchableDebounce onPress={() => onClose()}>
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
        <PagerView ref={pagerRef} style={styles.flex} initialPage={pageIndex} scrollEnabled={false}>
          <Page1 />
          <Page2 />
          <Page3 />
        </PagerView>
        <View
          style={{
            height: 52,
            paddingHorizontal: 16,
            backgroundColor: '#FF000000',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <TouchableDebounce onPress={decrement}>
              <View>
                <Text style={styles.buttonText} type="secondary">
                  {pageIndex > 0 ? 'Grįžti' : ''}
                </Text>
              </View>
            </TouchableDebounce>
          </View>
          <PagerDots count={3} currentIndex={pageIndex} />
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableDebounce onPress={increment}>
              <View style={{justifyContent: 'flex-start'}}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: colors.primary,
                    },
                  ]}>
                  {pageIndex < PAGE_COUNT - 1 ? 'Toliau' : 'Uždaryti'}
                </Text>
              </View>
            </TouchableDebounce>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationsModal;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  modal: {
    flex: 1,
    paddingTop: 12,
  },
  buttonText: {
    fontSize: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    borderRadius: 99,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  closeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    marginStart: 8,
  },
});
