export interface RootState {
  lang: string;
}

export const mutationTypes = {
  setPlotOption: 'setPlotOption',

  setAllCurrencies: 'setAllCurrencies',

  setLoading: 'setLoading',

  setTimeSeries: 'setTimeSeries',
};

export const actionTypes = {
  getAllCurrencies: 'getAllCurrencies',
  getCurrencyExtchangeRates: 'getCurrencyExtchangeRates',
  setCurrencyFrom: 'setCurrencyFrom',
  setCurrencyTo: 'setCurrencyTo',
};

export interface PlotOption {
  title: string;
  interval: string;
  period: number;
  timeDiff: number;
}

export const plotOptions: PlotOption[] = [
  {
    title: '15M',
    interval: 'minute',
    period: 1,
    //time diff in minutes
    timeDiff: 15,
  },
  {
    title: '1H',
    interval: 'minute',
    period: 1,
    timeDiff: 60,
  },
  {
    title: '1D',
    interval: 'hourly',
    period: 1,
    timeDiff: 60 * 24,
  },
  {
    title: '1M',
    interval: 'daily',
    period: 1,
    timeDiff: 60 * 24 * 30,
  },
];
