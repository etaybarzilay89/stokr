/**
 * Created by etay on 18/07/2017.
 */
(function () {

  let changePresentationEnum = {
    'percentage' : 0,
    'change' : 1,
    'capital' : 2,
    'length' : 3
  };
  let contentEnum = {
    'search' : 0,
    'stocks' : 1,
    'filter' : 2,
    'settings' : 3,
    'length' : 4
  };

  window.Stoker = window.Stoker || {};
  const view = window.Stoker.view;
  const model = window.Stoker.model;
  let state = model.getState();

  // public

  function shiftStocks(stockSymbol, direction) {
    let currentStockIndex = state.data.findIndex(stock => stock.Symbol === stockSymbol);
    let switchStockIndex = (direction === 'up') ? currentStockIndex - 1 : currentStockIndex + 1;
    let tempStock = state.data[currentStockIndex];
    state.data[currentStockIndex] = state.data[switchStockIndex];
    state.data[switchStockIndex] = tempStock;

    view.renderHtmlPage(model.getState());
  }

  function toggleChange() {
    state.ui.change = (state.ui.change + 1) % changePresentationEnum.length;

    view.renderHtmlPage(model.getState());
  }

  function updateScreen(screenId) {
    state.ui.screen = screenId;
    initializeData();

    view.renderHtmlPage(model.getState());
  }

  function filterStocks(filteredFields) {
    if (!(filteredFields['name'] && filteredFields['gain'] && filteredFields['from'] && filteredFields['to'])) {
      state.filteredData = state.stocks;
    }
    const name = filteredFields['name'].toLowerCase();
    state.filteredData = state.data.filter(stock => stock.Name.toLowerCase().includes(name));

    view.renderHtmlPage(model.getState());
  }

  // private

  function initializeData() {
    state.data = model.getState().data;
    state.filteredData = state.data;
  }

  function init() {
    const state = model.getState();

    view.init(contentEnum, changePresentationEnum);
    model.init(contentEnum, changePresentationEnum);
    view.renderHtmlPage(state);
  }

  window.Stoker.controller = {
    shiftStocks,
    toggleChange,
    updateScreen,
    filterStocks
  };

  init();
})();


