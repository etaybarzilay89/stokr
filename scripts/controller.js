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
    const name = filteredFields['name'].toLowerCase();
    const gain = filteredFields['gain'].toLowerCase();
    const from = parseFloat(filteredFields['from']);
    const to = parseFloat(filteredFields['to']);

    if (!(name || gain !== 'all' || from || to)) {
      state.filteredData = state.stocks;
    }

    const percentChange = stock => parseFloat(stock.PercentChange);
    const namePredicate = stock => (!name || stock.Name.toLowerCase().includes(name));
    const gainPredicate = stock => (gain === 'all' ||
      gain === 'positive' && percentChange(stock) >= 0 ||
      gain === 'negative' && percentChange(stock) < 0);

    const fromPredicate = stock => (!from && from !== 0 || percentChange(stock) >= from);
    const toPredicate = stock => (!to  && to !== 0 || percentChange(stock) < to);

    state.filteredData = state.data.filter(stock => namePredicate(stock) && gainPredicate(stock) && fromPredicate(stock) && toPredicate(stock));
    updateFilterInputs(name, gain, from, to);
    view.renderHtmlPage(model.getState());
  }

  // private

  function updateFilterInputs(name, gain, from, to) {
    let stringFrom = isNaN(from) ? '' : from;
    let stringTo = isNaN(to) ? '' : to;
    state.ui.filter = {name: name, gain: gain, from: stringFrom, to: stringTo};
  }

  function fetchStocks() {
    let stocks = fetch("/stokr/mocks/stocks.json").then(response => response.json());
    return stocks;
  }

  function initializeData() {
    state.data = model.getState().data;
    state.filteredData = state.data;
  }

  function init() {
    const state = model.getState();
    view.init(contentEnum, changePresentationEnum);
    model.init(contentEnum, changePresentationEnum);
    view.renderHtmlPage(state);

    setTimeout(() => {
      fetchStocks().then(data => state.data = data).then(() => {
        view.renderHtmlPage(state);
      });
    }, 10);

  }

  window.Stoker.controller = {
    shiftStocks,
    toggleChange,
    updateScreen,
    filterStocks
  };

  init();
})();


