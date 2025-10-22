import {useAuth0} from 'react-native-auth0';
import {authInterceptor} from '../api/HttpClient';
import {useEffect} from 'react';

const useAuthInterceptor = () => {
  const {getCredentials, hasValidCredentials, user} = useAuth0();

  useEffect(() => {
    if (!user) {
      authInterceptor.setAuthGetter(null);
      return;
    }

    const idTokenProvider = async () => {
      if (await hasValidCredentials()) {
        const credentials = await getCredentials();
        return credentials!.idToken;
      } else {
        throw new Error('No valid credentials');
      }
    };

    console.log('useAuthInterceptor: user found, setting interceptor');
    authInterceptor.setAuthGetter(idTokenProvider);

    return () => authInterceptor.setAuthGetter(null);
  }, [user]);
};

export default useAuthInterceptor;
