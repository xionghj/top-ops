import axios from 'axios';
import { message as $message } from 'ant-design-vue';
import { uniqueSlash } from './urlUtils';
import type { AxiosRequestConfig } from 'axios';

export interface RequestOptions {
  /** 是否直接获取data，而忽略message等 */
  isGetDataDirectly?: boolean;
  /** 请求成功是提示信息 */
  successMsg?: string;
  /** 请求失败是提示信息 */
  errorMsg?: string;
}

const UNKNOWN_ERROR = '未知错误，请重试';
/** 真实请求的路径前缀 */
// const baseApiUrl = 'http://192.168.253.207:8000/';
const baseApiUrl = 'api/';

const service = axios.create({
  // baseURL: baseApiUrl,
  timeout: 6000,
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ACCESS_TOKEN_KEY') || '';
    if (token && config.headers) {
      // 请求头token信息，请根据实际情况进行修改
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // if the custom code is not 200, it is judged as an error.
    return res;
  },
  (error) => {
    // 处理 422 或者 500 的错误异常提示
    const errMsg = error?.response?.data?.detail ?? UNKNOWN_ERROR;
    $message.error(errMsg);
    error.message = errMsg;
    return Promise.reject(error);
  },
);

export type Response<T = any> = {
  code: number;
  message: string;
  data: T;
};

export type BaseResponse<T = any> = Promise<Response<T>>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = async <T = any>(config: AxiosRequestConfig, options: RequestOptions = {}): Promise<T> => {
  try {
    const { successMsg, errorMsg, isGetDataDirectly = false } = options;
    const fullUrl = `${baseApiUrl + config.url}`;
    config.url = uniqueSlash(fullUrl);
    const res = await service.request(config);
    successMsg && $message.success(successMsg);
    errorMsg && $message.error(errorMsg);
    return isGetDataDirectly ? res.data : res;
  } catch (error: any) {
    return Promise.reject(error);
  }
};
