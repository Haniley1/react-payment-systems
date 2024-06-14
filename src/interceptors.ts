import axios, { CancelTokenSource } from 'axios';
import { TRACK_SESSION_REQUEST_URl } from './api/model';

const log = (prefix: string, styles = 'background: Lavender; color: DimGray') => (data: any) =>
  console.log(`%c[ ${prefix} ]`, styles, data);

const success = log('success', 'background: OliveDrab; color: White');

const USE_HTTP_MOCKS = false;

const NonCancelableUrls: Set<string> = new Set();
const ActiveRequests: Map<string, CancelTokenSource> = new Map();

export const interceptors = () => {
  NonCancelableUrls.add(TRACK_SESSION_REQUEST_URl);

  const sameResourceRequestInterceptor = axios.interceptors.request.use(
    config => {
      const { url } = config;

      if (!url || NonCancelableUrls.has(url)) return config;

      const cancelTokenSource = ActiveRequests.get(url);

      if (cancelTokenSource) {
        cancelTokenSource.cancel();
      }
      const cancelToken = axios.CancelToken;
      const source = cancelToken.source();

      config.cancelToken = source.token;

      ActiveRequests.set(url, source);

      return config;
    },
    error => Promise.reject(error)
  );

  const sameResourceResponseInterceptor = axios.interceptors.response.use(
    response => {
      const { config } = response;

      if (!config.url) return response;

      const cancelTokenSource = ActiveRequests.get(config.url);

      if (cancelTokenSource) {
        ActiveRequests.delete(config.url);
      }

      return response;
    },
    error => Promise.reject(error)
  );


  if (!USE_HTTP_MOCKS) {
    return;
  }

  const mockInterceptor = axios.interceptors.response.use(response => {
    // const {url, method} = response.config;

    return response;
  }, (error) => {
    const {config, data} = error;

    if (config && data) {
      success({config, data});

      return Promise.resolve({
        config,
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
      });
    }

    return Promise.reject(error);
  });

  return () => {
    axios.interceptors.request.eject(sameResourceRequestInterceptor);
    axios.interceptors.request.eject(sameResourceResponseInterceptor);
    axios.interceptors.response.eject(mockInterceptor);
  };
};
