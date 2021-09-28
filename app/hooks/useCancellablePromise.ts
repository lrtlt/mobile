import {useCallback} from 'react';
import useIsMounted from './useIsMounted';

export default () => {
  const isMounted = useIsMounted();

  return useCallback(
    <T>(promise: Promise<T>, onCancel?: () => void) =>
      new Promise<T>((resolve, reject) => {
        promise
          .then((result) => {
            if (isMounted()) {
              resolve(result);
            }
          })
          .catch((error) => {
            if (isMounted()) {
              reject(error);
            }
          })
          .finally(() => {
            if (!isMounted() && onCancel) {
              onCancel();
            }
          });
      }),
    [isMounted],
  );
};
