/**
 * Created by etay on 23/07/2017.
 */

(function () {

  let stocks = [];
  // let stocks = [
  //   {
  //     "Symbol": "WIX",
  //     "Name": "Wix.com Ltd.",
  //     "Change": "0.750000",
  //     "PercentChange": "+1.51%",
  //     "Capital": "4",
  //     "LastTradePriceOnly": "76.099998"
  //   },
  //   {
  //     "Symbol": "MSFT",
  //     "Name": "Microsoft Corporation",
  //     "PercentChange": "-2.09%",
  //     "Change": "-0.850006",
  //     "Capital": "-1",
  //     "LastTradePriceOnly": "69.620003"
  //   },
  //   {
  //     "Symbol": "BLAA1",
  //     "Name": "BLAA1! Inc.",
  //     "Change": "0.279999",
  //     "PercentChange": "+11.11%",
  //     "Capital": "6",
  //     "LastTradePriceOnly": "150.599998"
  //   },
  //   {
  //     "Symbol": "BLAA2",
  //     "Name": "BLAA2! Inc.",
  //     "Change": "0.279999",
  //     "PercentChange": "+111.11%",
  //     "Capital": "7",
  //     "LastTradePriceOnly": "5.4499998"
  //   },
  //   {
  //     "Symbol": "BLAA3",
  //     "Name": "BLAA3! Inc.",
  //     "Change": "0.279999",
  //     "PercentChange": "+21.11%",
  //     "Capital": "8",
  //     "LastTradePriceOnly": "4250.119998"
  //   },
  //   {
  //     "Symbol": "BLAA4",
  //     "Name": "BLAA4! Inc.",
  //     "Change": "0.279999",
  //     "PercentChange": "+0.11%",
  //     "Capital": "9",
  //     "LastTradePriceOnly": "11150.319998"
  //   }
  // ];

  let content = {};
  let changePresentation = {};
  let filteredStocks = stocks;

  window.Stoker = window.Stoker || {};
  let state = {
    ui: {
      screen: content.stocks,
      change: changePresentation.percentage,
      filter: {
        'name' : '',
        'gain' : 'All',
        'from' : '',
        'to' : ''
      }
    },
    data: stocks,
    filteredData: filteredStocks
  };

  // public

  function getState() {
    return state;
  }

  function init(screensEnum, changeEnum) {
    content = screensEnum;
    changePresentation = changeEnum;
    state.ui.change = changePresentation.percentage;
    state.ui.screen = content.stocks;
    state.filteredData = state.data;
  }

  window.Stoker.model = {
    getState,
    init
  };


})();
