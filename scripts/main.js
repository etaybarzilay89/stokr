/**
 * Created by etay on 18/07/2017.
 */
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

function renderStock(stock) {
  const change = PresentChangeInPercentage? stock.PercentChange : (Math.trunc(stock.Change * 10) / 10) + 'B';
  const lastTradePriceTrunced = Math.trunc(stock.LastTradePriceOnly * 100) / 100;
  const changeState = parseFloat(change) >= 0 ? 'increase' : 'decrease';
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
          <button class="icon-arrow"></button>
          <button class="icon-arrow icon-reverse"></button>
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
    const stockList = e.currentTarget;

    if (target.classList.contains('daily-change')) {
      PresentChangeInPercentage = !PresentChangeInPercentage;
    }

    if (target.classList.contains('icon-reverse')) {
      alert("down");
    } else if (target.classList.contains('icon-arrow')) {
      alert("up");
    }

    renderHtmlPage();
}
let PresentChangeInPercentage = true;
const mainElement = document.querySelector('main');
renderHtmlPage();


