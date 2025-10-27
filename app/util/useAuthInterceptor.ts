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
      if (await hasValidCredentials()) {
        const credentials = await getCredentials();
        return credentials!.idToken;
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
