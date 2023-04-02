// @ts-ignore
import axios from 'axios/dist/axios';

const _API_KEY = 'DM_GtTVIrWxa_SIIEW_L';

// @ts-ignore
const api: AxiosInstance = axios.create({
  baseURL: 'https://marketdata.tradermade.com/api/',
});

export default api;

export const defaultParams = {
  api_key: _API_KEY,
};

export const ENDPOINT_CURRENCIES_LIST = `v1/live_currencies_list`;
export const ENDPOINT_CONVERT = `/v1/convert`;
export const ENDPOINT_TIME_SERIES = `v1/timeseries`;
