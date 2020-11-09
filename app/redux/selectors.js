export const selectNavigationIsReady = (state) => {
  return state.navigation.isReady && state.navigation.routes.length !== 0;
};

export const selectSplashScreenState = (state) => {
  return {
    isReady: state.navigation.isReady,
    isLoading: state.navigation.isLoading,
    isError: state.navigation.isError,
    hasMenuData: state.navigation.routes.length !== 0,
  };
};
