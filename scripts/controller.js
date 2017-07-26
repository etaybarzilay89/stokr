/**
 * Created by etay on 18/07/2017.
 */
(function () {

  const changePresentationEnum = {
    'percentage': 0,
    'change': 1,
    'capital': 2,
    'length': 3
  };
  const contentEnum = {
    'search': 0,
    'stocks': 1,
    'filter': 2,
    'settings': 3,
    'refresh' : 4,
    'length': 5
  };

  window.Stoker = window.Stoker || {};
  const view = window.Stoker.view;
  const model = window.Stoker.model;
  let state = model.getState();

  // public

  function removeStock(stockSymbol) {
    let stockIndex = state.data.findIndex(stock => stock.Symbol === stockSymbol);
    state.data.splice(stockIndex, 1);
    state.requestedStocks.splice(stockIndex, 1);
    refreshData();
  }

  function shiftStocks(stockSymbol, direction) {
    let stocksIndexes = findSwitchedStocksIndexes(stockSymbol, direction, state.data);
    shiftStocksInArray(state.data, stocksIndexes.current, stocksIndexes.switch);
    shiftStocksInArray(state.requestedStocks, stocksIndexes.current, stocksIndexes.switch);

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

  function refreshData() {
    const state = model.getState();

    fetchStocks(state.requestedStocks)
      .then(updateData)
      .then(() => view.renderHtmlPage(state));
  }

  function filterStocks(filteredFields) {
    const name = filteredFields['name'].toLowerCase();
    const gain = filteredFields['gain'].toLowerCase();
    const from = parseFloat(filteredFields['from']);
    const to = parseFloat(filteredFields['to']);

    if (!(name || gain !== 'all' || from || to)) {
      state.filteredData = state.stocks;
    }

    const percentChange = stock => parseFloat(stock.realtime_chg_percent);
    const namePredicate = stock => (!name || stock.Name.toLowerCase().includes(name));
    const gainPredicate = stock => (gain === 'all' ||
    gain === 'positive' && percentChange(stock) >= 0 ||
    gain === 'negative' && percentChange(stock) < 0);

    const fromPredicate = stock => (!from && from !== 0 || percentChange(stock) >= from);
    const toPredicate = stock => (!to && to !== 0 || percentChange(stock) < to);


    state.filteredData = state.data.filter(stock => namePredicate(stock) && gainPredicate(stock) && fromPredicate(stock) && toPredicate(stock));
    updateFilterInputs(name, gain, from, to);
    view.renderHtmlPage(model.getState());
  }

  // private

  function findSwitchedStocksIndexes(stockSymbol, direction, stocks) {
    let currentStockIndex = stocks.findIndex(stock => stock.Symbol === stockSymbol);
    let switchStockIndex = (direction === 'up') ? currentStockIndex - 1 : currentStockIndex + 1;

    return {
      'current' : currentStockIndex,
      'switch' : switchStockIndex
    };
  }

  function shiftStocksInArray(stockArray, currentIndex, switchIndex) {
    let tempStock = stockArray[currentIndex];
    stockArray[currentIndex] = stockArray[switchIndex];
    stockArray[switchIndex] = tempStock;
  }

  function updateData(data) {
    const state = model.getState();
    state.data = data;
  }

  function updateFilterInputs(name, gain, from, to) {
    let stringFrom = isNaN(from) ? '' : from;
    let stringTo = isNaN(to) ? '' : to;
    state.ui.filter = {name: name, gain: gain, from: stringFrom, to: stringTo};
  }

  function fetchStocks(requestedStocks) {
    //using stocks.json mock file.
    // return stocks = fetch("/stokr/mocks/stocks.json")
    //   .then(response => response.json());

    return stocks = fetch(`http://localhost:7000/quotes?q=${requestedStocks}`)
      .then(response => response.json())
      .then(data => data.query.results ? data.query.results.quote : [] )
      .then(data => Array.isArray(data) ? data : [data]);
  }

  function initializeData() {
    state.data = model.getState().data;
    state.filteredData = state.data;
    updateFilterInputs('', '', '', '');
  }

  function init() {
    const state = model.getState();
    view.init(contentEnum, changePresentationEnum);
    model.init(contentEnum, changePresentationEnum);

    if (view.getHashValue() === 'search') {
      updateScreen(contentEnum.search);
    }

    view.renderHtmlPage(state);

    refreshData();
    setInterval(refreshData, 600000);
  }

  window.Stoker.controller = {
    shiftStocks,
    toggleChange,
    updateScreen,
    filterStocks,
    refreshData,
    removeStock
  };

  init();
})();


