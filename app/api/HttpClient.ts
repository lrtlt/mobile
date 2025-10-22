import Axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import * as AxiosLogger from 'axios-logger';
import AuthInterceptor from './AuthInterceptor';

const LOGGING_ENABLED = __DEV__;
const LOGGING_DATA = __DEV__;

const LrtClient = Axios.create({
  timeout: 1000 * 10,
});

if (__DEV__) {
  AxiosLogger.setGlobalConfig({
    data: false,
    headers: false,
    prefixText: 'API',
  });

  // Request logging
  // LrtClient.interceptors.request.use((request) => {
  //   if (LOGGING_ENABLED) {
  //     return AxiosLogger.requestLogger(request);
  //   } else {
  //     return request;
  //   }
  // });

  //Response logging
  LrtClient.interceptors.response.use(
    (response) => {
      if (LOGGING_ENABLED) {
        return AxiosLogger.responseLogger(response);
      } else {
        return response;
      }
    },
    (error) => {
      return AxiosLogger.errorLogger(error);
    },
  );

  LrtClient.interceptors.response.use((response) => {
    if (LOGGING_ENABLED && LOGGING_DATA) {
      console.log(response.data);
    }
    return response;
  });
}

//Auth interceptor
export const authInterceptor = new AuthInterceptor();
LrtClient.interceptors.request.use(authInterceptor.intercept);

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await LrtClient.get<T>(encodeURI(url), config);
  return response.data;
};

export const put = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return LrtClient.put<T>(url, data, config);
};

export const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return LrtClient.post<T>(url, data, config);
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return LrtClient.delete<T>(url, config);
};
