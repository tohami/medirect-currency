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
              <Label col="0" text.decode="&#xf5da;" class="fas"></Label>
              <Label :text="currencyFrom" />
            </StackLayout>

            <StackLayout @tap="selectCurrencyTo" orientation="horizontal">
              <Label col="0" text.decode="&#xf5da;" class="fas"></Label>
              <Label :text="currencyTo" />
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
      </StackLayout>
    </AbsoluteLayout>
  </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import { actionTypes, mutationTypes } from '../store/types';
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
      // difference: '🔼 0.0123',
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
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 5;
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
Label {
  font-size: 16;
}

Button {
  margin-top: 10;
}
</style>