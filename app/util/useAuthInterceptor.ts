import {useAuth0} from 'react-native-auth0';
import {authInterceptor} from '../api/HttpClient';
import {useEffect} from 'react';
import {useFavoriteArticleSync} from '../api/hooks/useFavoriteArticles';

const useAuthInterceptor = () => {
  const {getCredentials, hasValidCredentials, user, isLoading} = useAuth0();

  const {mutate: syncFavorites} = useFavoriteArticleSync();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      authInterceptor.setAuthGetter(null);
      return;
    }

    const idTokenProvider = async () => {
      const minTtlSeconds = 60 * 30; // 30 minutes
      if (await hasValidCredentials(minTtlSeconds)) {
        const credentials = await getCredentials('openid profile email offline_access');
        // console.log('credentials', credentials);
        // console.log('expiresAt', new Date(credentials.expiresAt * 1000).toString());
        return credentials!.accessToken;
      } else {
        throw new Error('No valid credentials');
      }
    };
    authInterceptor.setAuthGetter(idTokenProvider);

    syncFavorites();

    return () => authInterceptor.setAuthGetter(null);
  }, [user, isLoading]);
};

export default useAuthInterceptor;
