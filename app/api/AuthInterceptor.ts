import {InternalAxiosRequestConfig} from 'axios';

class AuthInterceptor {
  getToken: (() => Promise<string>) | null = null;

  setAuthGetter = (getToken: (() => Promise<string>) | null) => {
    this.getToken = getToken;
  };

  intercept = async (config: InternalAxiosRequestConfig) => {
    if (!this.getToken) {
      console.warn('AuthInterceptor: no getToken function set');
      return config;
    }

    try {
      const token = await this.getToken();
      config.headers.set('Authorization', `Bearer ${token}`);
    } catch (e) {
      console.error('Error setting Authorization header:', e);
    }
    return config;
  };
}

export default AuthInterceptor;
