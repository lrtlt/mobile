import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {useCallback} from 'react';
import Config from 'react-native-config';
import {useAuth0} from 'react-native-auth0';

const useLogin = () => {
  const {authorize, saveCredentials} = useAuth0();

  const login = useCallback(() => {
    authorize({
      //"openid profile email" are default scopes
      //"offline_access" is needed to get refresh token
      scope: 'openid profile email offline_access',
      audience: Config.AUTH0_AUDIENCE,

      ui_locales: 'lt',
    } as any)
      .then(saveCredentials)
      .then(() => logEvent(getAnalytics(), 'app_lrt_lt_user_signed_in'));
  }, [authorize, saveCredentials]);

  return {
    login,
  };
};

export default useLogin;
