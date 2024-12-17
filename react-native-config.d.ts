declare module 'react-native-config' {
  export interface NativeConfig {
    GEMIUS_APP_NAME: string;
    GEMIUS_VIEW_SCRIPT_ID: string;
    GEMIUS_PLAYER_SCRIPT_ID: string;
    APP_CHECK_DEBUG_TOKEN_ANDROID: string;
    APP_CHECK_DEBUG_TOKEN_IOS: string;
    CHARTBEAT_ACCOUNT_ID: string;
    CHARTBEAT_DASHBOARD_ID: string;
    THEO_PLAYER_LICENCE: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
