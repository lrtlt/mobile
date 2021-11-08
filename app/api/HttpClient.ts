import Axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import * as AxiosLogger from 'axios-logger';

const LOGGING_ENABLED = true;
const LOGGING_DATA = true;

const LrtClient = Axios.create({
  timeout: 1000 * 10,
});

if (__DEV__) {
  AxiosLogger.setGlobalConfig({
    data: false,
    headers: false,
    prefixText: 'API',
  });

  //Request logging
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

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await LrtClient.get<T>(url, config);
  return response.data;
};

export const put = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return LrtClient.put<T>(url, data, config);
};
