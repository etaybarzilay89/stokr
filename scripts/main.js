/**
 * Created by etay on 18/07/2017.
 */
(function () {
  let stocks = [
    {
      "Symbol": "WIX",
      "Name": "Wix.com Ltd.",
      "Change": "0.750000",
      "PercentChange": "+1.51%",
      "Capital": "4",
      "LastTradePriceOnly": "76.099998"
    },
    {
      "Symbol": "MSFT",
      "Name": "Microsoft Corporation",
      "PercentChange": "-2.09%",
      "Change": "-0.850006",
      "Capital": "-1",
      "LastTradePriceOnly": "69.620003"
    },
    {
      "Symbol": "BLAA1",
      "Name": "BLAA1! Inc.",
      "Change": "0.279999",
      "PercentChange": "+11.11%",
      "Capital": "6",
      "LastTradePriceOnly": "150.599998"
    },
    {
      "Symbol": "BLAA2",
      "Name": "BLAA2! Inc.",
      "Change": "0.279999",
      "PercentChange": "+111.11%",
      "Capital": "7",
      "LastTradePriceOnly": "5.4499998"
    },
    {
      "Symbol": "BLAA3",
      "Name": "BLAA3! Inc.",
      "Change": "0.279999",
      "PercentChange": "+21.11%",
      "Capital": "8",
      "LastTradePriceOnly": "4250.119998"
    },
    {
      "Symbol": "BLAA4",
      "Name": "BLAA4! Inc.",
      "Change": "0.279999",
      "PercentChange": "+0.11%",
      "Capital": "9",
      "LastTradePriceOnly": "11150.319998"
    },
  ];
  let changePresentation = {
    'percentage' : 0,
    'change' : 1,
    'capital' : 2,
    'length' : 3
  };
  let content = {
    'search' : 0,
    'stocks' : 1,
    'filter' : 2,
    'settings' : 3,
    'length' : 4
  };

  function dispatchEvents(e) {
    const target = e.target;
    const currentTarget = e.currentTarget;

    if (currentTarget.classList.contains('app-header'))
    {
      dispatchHeaderEvents(e);
    }

    if (target.classList.contains('daily-change')) {
      presentChangeInPercentage = (presentChangeInPercentage + 1) % changePresentation.length;
    }

    let targetDataSymbol = target.getAttribute('data-symbol');
    if (target.classList.contains('icon-reverse')) {
      ShiftStocks(targetDataSymbol, 'down');
    } else if (target.classList.contains('icon-arrow')) {
      ShiftStocks(targetDataSymbol, 'up');
    }

    renderHtmlPage();
  }
  function dispatchHeaderEvents(e) {
    const target = e.target;

    if (target.classList.contains('selected'))
    {
      presentedContent = content.stocks;
      return;
    }
    if (target.classList.contains('search')) {
      presentedContent = content.search;
    }
    if (target.classList.contains('filter')) {
      presentedContent = content.filter;
    }
    if (target.classList.contains('settings')) {
      presentedContent = content.settings;
    }
  }
  function renderHtmlPage() {
    rootElement.innerHTML = renderHeader() + renderMainContent();
    rootElement.querySelector('.main-content').addEventListener('click', dispatchEvents);
    rootElement.querySelector('.app-header').addEventListener('click', dispatchEvents);
  }
  function renderHeader() {
    let searchSelected = presentedContent === content.search ? 'selected' : '';
    let filterSelected = presentedContent === content.filter ? 'selected' : '';
    let settingsSelected = presentedContent === content.settings ? 'selected' : '';

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
  function renderMainContent() {
    let contentString = `<main class="main-content">`;

    if (presentedContent !== content.settings) {
      if (presentedContent === content.filter)
      {
        contentString += `${renderFilter()}`;
      }
      contentString += `${renderStocks(stocks)}`;
    }

    contentString += `</main>`;
    return contentString;

  }
  function renderStocks(stocks) {
    return `
    <ul class="stock-list list-reset">
      ${stocks.map(renderStock).join('')}
    </ul>
    `;
  }
  function renderStock(stock, index) {
    const change = getChangePresentation(stock);
    const lastTradePriceTrunced = Math.trunc(stock.LastTradePriceOnly * 100) / 100;
    const changeState = parseFloat(change) >= 0 ? 'increase' : 'decrease';
    const upDisabled = index === 0 ? 'disabled' : '';
    const bottomDisabled = index === stocks.length - 1 ? 'disabled' : '';
    const hide = presentedContent === content.filter ? 'hide' : '';
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
  function ShiftStocks(stockSymbol, direction) {
    let currentStockIndex = stocks.findIndex(stock => stock.Symbol === stockSymbol);
    let switchStockIndex = (direction === 'up') ? currentStockIndex - 1 : currentStockIndex + 1;
    let tempStock = stocks[currentStockIndex];
    stocks[currentStockIndex] = stocks[switchStockIndex];
    stocks[switchStockIndex] = tempStock;
  }
  function renderFilter() {
    return `
    <section class="filter">
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
  function getChangePresentation(stock) {
    if (presentChangeInPercentage === changePresentation.percentage)
    {
      return stock.PercentChange;
    } else if (presentChangeInPercentage === changePresentation.change) {
      return (Math.trunc(stock.Change * 10) / 10) + 'B';
    }

    return stock.Capital;

  }

  let presentedContent = content.stocks;
  let presentChangeInPercentage = changePresentation.percentage;
  const rootElement = document.querySelector('.root');
  renderHtmlPage();
})();


