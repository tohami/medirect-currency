export interface RootState {
  lang: string;
}

export const mutationTypes = {
  setAllCurrencies: 'setAllCurrencies',

  setLoading: 'setLoading',

  setTimeSeries: 'setTimeSeries',

  setCurrentPrice: 'setCurrentPrice',
};

export const actionTypes = {
  getAllCurrencies: 'getAllCurrencies',
  getCurrencyExtchangeRates: 'getCurrencyExtchangeRates',
  setCurrencyFrom: 'setCurrencyFrom',
  setCurrencyTo: 'setCurrencyTo',
  setPlotOption: 'setPlotOption',
  setSocketConnected: 'setSocketConnected',
};

export interface PlotOption {
  title: string;
  interval: string;
  period: number;
  timeDiff: number;
  timeFormat: string;
}

export const plotOptions: PlotOption[] = [
  {
    title: '15M',
    interval: 'minute',
    period: 1,
    //time diff in minutes
    timeDiff: 15,
    timeFormat: 'mm',
  },
  {
    title: '1H',
    interval: 'minute',
    period: 5,
    timeDiff: 60,
    timeFormat: 'mm',
  },
  {
    title: '1D',
    interval: 'hourly',
    period: 2,
    timeDiff: 60 * 24,
    timeFormat: 'HH',
  },
  {
    title: '1M',
    interval: 'daily',
    period: 2,
    timeDiff: 60 * 24 * 30,
    timeFormat: 'DD',
  },
];
