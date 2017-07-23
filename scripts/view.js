/**
 * Created by etay on 23/07/2017.
 */

(function () {
  // view
  let eventsHandler;
  let content = {};
  let changePresentation = {};

  window.Stoker = window.Stoker || {};

  //private

  function renderMainContent(state) {
    let contentString = `<main class="main-content">`;
    const stocks = state.data;

    if (!isScreen(state.ui.screen, 'settings')) {
      if (isScreen(state.ui.screen, 'filter')) {
        contentString += `${renderFilter()}`;
      }
      contentString += `${renderStocks(stocks, state.ui.change, state.ui.screen)}`;
    }

    contentString += `</main>`;
    return contentString;

  }

  function renderHeader(screenId) {
    let searchSelected = isScreen(screenId, 'search') ? 'selected' : '';
    let filterSelected = isScreen(screenId, 'filter') ? 'selected' : '';
    let settingsSelected = isScreen(screenId, 'settings') ? 'selected' : '';

    return `
    <header class="app-header">
        <h1 class="stokr-logo">STOKR</h1>
        <nav class="nav-bar">
          <ul class="list-reset">
            <li><button class="btn search icon-search ${searchSelected}"></button></li>
            <li><button class="btn refresh icon-refresh"></button></li>
            <li><button class="btn filter icon-filter ${filterSelected}"></button></li>
            <li><button class="btn settings icon-settings ${settingsSelected}"></button></li>
          </ul>
        </nav>
      </header>
    `;
  }

  function renderStocks(stocks, changePresentation, screenId) {
    return `
    <ul class="stock-list list-reset">
      ${stocks.map((stock, index, stocks) => {
        return renderStock(stock, index, stocks, changePresentation, screenId)
    }).join('')}
    </ul>
    `;
  }

  function renderStock(stock, index, stocks, changePresentation, screenId) {
    const change = getChangePresentation(stock, changePresentation);
    const lastTradePriceTrunced = Math.trunc(stock.LastTradePriceOnly * 100) / 100;
    const changeState = parseFloat(change) >= 0 ? 'increase' : 'decrease';
    const upDisabled = index === 0 ? 'disabled' : '';
    const bottomDisabled = index === stocks.length - 1 ? 'disabled' : '';
    const hide = isScreen(screenId, 'filter') ? 'hide' : '';
    return `
      <li>
        <div class="stock-naming-data">
          <span class="stock-symbol">${stock.Symbol}</span>
          <span class="stock-name">(${stock.Name})</span>
        </div>
        <div class="stock-numbers">
          <span class="current-price">${lastTradePriceTrunced}</span>
          <button class="daily-change ${changeState}">${change}</button>
          <div class="up-down ${hide}">
            <button data-symbol="${stock.Symbol}" class="icon-arrow ${upDisabled}" ${upDisabled}></button>
            <button data-symbol="${stock.Symbol}" class="icon-arrow icon-reverse ${bottomDisabled}" ${bottomDisabled}></button>
          </div>
        </div>
      </li>
    `;
  }

  function renderFilter() {
    return `
    <section class="filter-section">
      <form class="filter-form">
        <div class="filter-text">
          <div>
            <label for="by-name-id">By Name</label>
            <input type="text" name="by-name" id="by-name-id">
          </div>
          <div>
            <label for="by-range-from-id">By Range: From</label>
            <input type="text" name="by-range-from" id="by-range-from-id">
          </div>
          <div>
            <label for="by-gain-id">By Gain</label>
            <input type="text" name="by-gain" id="by-gain-id">
          </div>
          <div>
            <label for="by-range-to-id">By Range: To</label>
            <input type="text" name="by-range-to" id="by-range-to-id">
          </div>
        </div>
        <div class="submit-container">
          <button type="submit">Apply</button>
        </div>
      </form>
    </section>
    `
  }

  function isScreen(screenId, screenName) {
    const screenNameId = findScreenIdByName(screenName);
    return screenNameId === screenId;
  }

  function findScreenIdByName(screenName) {
    if (screenName === 'search') {
      return content.search;
    } else if(screenName === 'filter') {
      return content.filter;
    } else if (screenName === 'settings') {
      return content.settings;
    } else if (screenName === 'stocks') {
      return content.stocks;
    } else {
      return false;
    }
  }

  function getChangePresentation(stock, changeState) {
    const stockChange = changeState;
    if (stockChange === changePresentation.percentage)
    {
      return stock.PercentChange;
    } else if (stockChange === changePresentation.change) {
      return (Math.trunc(stock.Change * 10) / 10) + 'B';
    }

    return stock.Capital;
  }

  // public

  function init(eventsHandlersPtr, screensEnum, changeEnum) {
      eventsHandler = eventsHandlersPtr;
      content = screensEnum;
      changePresentation = changeEnum;
  }

  function renderHtmlPage(state) {
    const rootElement = document.querySelector('.root');
    rootElement.innerHTML = renderHeader(state.ui.screen) + renderMainContent(state);
    rootElement.querySelector('.stock-list') &&  rootElement.querySelector('.stock-list').addEventListener('click', eventsHandler[0]);
    rootElement.querySelector('.app-header') && rootElement.querySelector('.app-header').addEventListener('click', eventsHandler[1]);
    rootElement.querySelector('.filter-section') && rootElement.querySelector('.filter-section').addEventListener('click', eventsHandler[2]);
  }

  window.Stoker.view = {
    renderHtmlPage,
    init
  }

})();
