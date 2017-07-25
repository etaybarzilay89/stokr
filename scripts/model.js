/**
 * Created by etay on 23/07/2017.
 */

(function () {

  let stocks = [];
  let requestedStocks = ['GOOG','WIX','MSFT'];
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
        'gain' : 'all',
        'from' : '',
        'to' : ''
      }
    },
    data: stocks,
    requestedStocks : requestedStocks,
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
