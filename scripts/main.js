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
      "LastTradePriceOnly": "76.099998"
    },
    {
      "Symbol": "MSFT",
      "Name": "Microsoft Corporation",
      "PercentChange": "-2.09%",
      "Change": "-0.850006",
      "LastTradePriceOnly": "69.620003"
    },
    {
      "Symbol": "YHOO",
      "Name": "Yahoo! Inc.",
      "Change": "0.279999",
      "PercentChange": "+1.11%",
      "LastTradePriceOnly": "50.599998"
    }
  ];

  function renderStocks(stocks) {
    return `
    <ul class="stock-list list-reset">
      ${stocks.map(renderStock).join('')}
    </ul>
    `;
  }

  function renderStock(stock, index) {
    const change = PresentChangeInPercentage ? stock.PercentChange : (Math.trunc(stock.Change * 10) / 10) + 'B';
    const lastTradePriceTrunced = Math.trunc(stock.LastTradePriceOnly * 100) / 100;
    const changeState = parseFloat(change) >= 0 ? 'increase' : 'decrease';
    const upDisabled = index === 0 ? 'disabled' : '';
    const bottomDisabled = index === stocks.length - 1 ? 'disabled' : '';
    return `
      <li>
        <div class="stock-naming-data">
          <span class="stock-symbol">${stock.Symbol}</span>
          <span class="stock-name">(${stock.Name})</span>
        </div>
        <div class="stock-numbers">
          <span class="current-price">${lastTradePriceTrunced}</span>
          <button class="daily-change ${changeState}">${change}</button>
          <div class="up-down">
            <button data-symbol="${stock.Symbol}" class="icon-arrow ${upDisabled}" ${upDisabled}></button>
            <button data-symbol="${stock.Symbol}" class="icon-arrow icon-reverse ${bottomDisabled}" ${bottomDisabled}></button>
          </div>
        </div>
      </li>
    `;
  }

  function renderHtmlPage() {
    mainElement.innerHTML = renderStocks(stocks);
    mainElement.querySelector('.stock-list').addEventListener('click', dispatchEvents);
  }

  function dispatchEvents(e) {
    const target = e.target;

    if (target.classList.contains('daily-change')) {
      PresentChangeInPercentage = !PresentChangeInPercentage;
    }

    let targetDataSymbol = target.getAttribute('data-symbol');
    if (target.classList.contains('icon-reverse')) {
      ShiftStocks(targetDataSymbol, 'down');
    } else if (target.classList.contains('icon-arrow')) {
      ShiftStocks(targetDataSymbol, 'up');
    }

    renderHtmlPage();
  }

  function ShiftStocks(stockSymbol, direction) {
    let currentStockIndex = stocks.findIndex(stock => stock.Symbol === stockSymbol);
    let switchStockIndex = (direction === 'up') ? currentStockIndex - 1 : currentStockIndex + 1;
    let tempStock = stocks[currentStockIndex];
    stocks[currentStockIndex] = stocks[switchStockIndex];
    stocks[switchStockIndex] = tempStock;
  }

  let PresentChangeInPercentage = true;
  const mainElement = document.querySelector('main');
  renderHtmlPage();
})();


