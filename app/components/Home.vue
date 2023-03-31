<template>
  <Page>
    <AbsoluteLayout>
      <FlexboxLayout class="header-container">
        <Label class="title-label" text="Forex Exchange" />
        <Label
          class="subtitle-label"
          marginTop="20"
          text="Checkout the current price of the currency pair"
        />
      </FlexboxLayout>

      <StackLayout row="0" column="0" marginTop="120" width="100%">
        <FlexboxLayout
          class="currency-container"
          flexDirection="column"
          width="80%"
        >
          <FlexboxLayout justifyContent="space-between">
            <StackLayout @tap="selectCurrencyFrom" orientation="horizontal">
              <Label
                marginRight="10"
                fontSize="32"
                text.decode="&#xf0d7;"
                class="fas currency"
              ></Label>
              <Label class="currency" :text="currencyFrom" />
            </StackLayout>

            <StackLayout @tap="selectCurrencyTo" orientation="horizontal">
              <Label
                marginRight="10"
                text.decode="&#xf0d7;"
                class="fas currency"
              ></Label>
              <Label class="currency" :text="currencyTo" />
            </StackLayout>
          </FlexboxLayout>

          <FlexboxLayout justifyContent="center">
            <StackLayout @tap="selectCurrencyTo">
              <Label class="price" :text="currentPrice" />
              <Label
                class="diff"
                :class="{
                  'diff-positive': difference > 0,
                  'diff-negative': difference < 0,
                }"
                :text="
                  difference > 0
                    ? '▲ ' + difference.toFixed(3)
                    : '▼ ' + difference.toFixed(3)
                "
              />
            </StackLayout>
          </FlexboxLayout>
        </FlexboxLayout>

        <FlexboxLayout
          class="currency-container"
          flexDirection="column"
          marginTop="32"
          width="80%"
          backgroundColor="red"
        >
          <FlexboxLayout justifyContent="center">
            <StackLayout orientation="horizontal">
              <Label class="currency" :text="currencyFrom" />
              <Label class="currency" :text="currencyTo" />
            </StackLayout>
          </FlexboxLayout>

          <FlexboxLayout
            backgroundColor="blue"
            justifyContent="center"
            height="400"
          >
            <LineChart
              ref="chart"
              @loaded="onChartLoaded"
              width="300"
              height="400"
            />
          </FlexboxLayout>
        </FlexboxLayout>
      </StackLayout>
    </AbsoluteLayout>
  </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import { actionTypes, mutationTypes } from '../store/types';
import { LineChart } from '@nativescript-community/ui-chart/charts/LineChart';
import { LineDataSet } from '@nativescript-community/ui-chart/data/LineDataSet';
import { LineData } from '@nativescript-community/ui-chart/data/LineData';

export default Vue.extend({
  created() {
    this.getAllCurrencies();
    this.getCurrencyExtchangeRates();
  },
  computed: mapState({
    currencies: (state: any) => state.currencies.allCurrencies || [],
    loading: (state: any) => state.currencies.currencyLoading,
    currencyFrom: (state: any) => state.currencies.currencyFrom,
    currencyTo: (state: any) => state.currencies.currencyTo,
    timeseries: (state: any) => state.currencies.timeseries || [],
    currentPrice: (state: any) => state.currencies.currentPrice,
    difference: (state: any) => state.currencies.difference,
  }),
  data() {
    return {
      title: 'Currency Converter',
      subtitle: 'Exchange rates',
      items: ['Option 1', 'Option 2', 'Option 3'],
      selectedItem: '',
    };
  },
  methods: {
    ...mapActions('currencies', [
      actionTypes.getAllCurrencies,
      actionTypes.getCurrencyExtchangeRates,
      actionTypes.setCurrencyFrom,
      actionTypes.setCurrencyTo,
    ]),
    ...mapMutations('currencies', []),
    selectCurrencyFrom() {
      // Handle selection of currency from

      action(
        'Choose currency from',
        'Cancel',
        this.currencies.map((e) => e[0])
      ).then((result) => {
        if (result !== 'cancel') {
          this.setCurrencyFrom(result);
        }
      });
    },
    selectCurrencyTo() {
      // Handle selection of currency to
      action(
        'Choose currency to',
        'Cancel',
        this.currencies.map((e) => e[0])
      ).then((result) => {
        if (result !== 'cancel') {
          this.setCurrencyTo(result);
        }
      });
    },
    onChartLoaded() {
      const chart = this.$refs.chart['nativeView'] as LineChart;
      chart.backgroundColor = 'white';

      // enable touch gestures
      chart.setTouchEnabled(true);

      chart.setDrawGridBackground(false);

      // enable scaling and dragging
      chart.setDragEnabled(true);
      chart.setScaleEnabled(true);

      // force pinch zoom along both axis
      chart.setPinchZoom(true);

      // disable dual axis (only use LEFT axis)
      chart.getAxisRight().setEnabled(false);

      const myData = new Array(500).fill(0).map((v, i) => ({
        index: i,
        value: Math.random() * 1,
      }));

      const sets = [];
      const set = new LineDataSet(myData, 'Legend Label', 'index', 'value');
      set.setColor('blue');
      sets.push(set);

      // Create a data object with the data sets
      const ld = new LineData(sets);

      // Set data
      chart.setData(ld);
    },
  },
});
</script>

<style scoped>
.header-container {
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 40;
  background-color: #c5e9ff;
  height: 180;
}

.title-label {
  font-weight: bold;
  color: black;
  font-size: 18;
}

.subtitle-label {
  color: gray;
  font-size: 16;
  color: #aaa;
}

.currency-container {
  margin-top: 20;
  padding: 20;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15;
  box-shadow: 0 5 5 rgba(0, 0, 0, 0.2);
}

.price {
  font-size: 32;
  margin-top: 20;
  text-align: center;
}
.diff {
  font-size: 24;
  margin-top: 10;
  text-align: center;
}
.diff-positive {
  color: #18cb90;
}
.diff-negative {
  color: red;
}
.currency {
  font-size: 32;
  font-weight: bold;
}

Label {
  font-size: 16;
}

Button {
  margin-top: 10;
}
</style>
