const API_KEY = "csthm61r01qq1rur2820csthm61r01qq1rur282g"; // Replace with your actual API key
const API_URL = `https://finnhub.io/api/v1/quote?symbol=`;

// Symbols for Top 10 Nasdaq stocks
const symbols = ["AAPL", "MSFT", "GOOG", "AMZN", "TSLA", "NVDA", "META", "AVGO", "COST", "NFLX"];

const companyNames = {
  AAPL: { name: "Apple Inc.", url: "https://tinyurl.com/vba4kazj" },
  MSFT: { name: "Microsoft Corporation", url: "https://www.microsoft.com" },
  GOOG: { name: "Alphabet Inc.", url: "https://www.google.com" },
  AMZN: { name: "Amazon.com Inc.", url: "https://www.amazon.com" },
  TSLA: { name: "Tesla Inc.", url: "https://www.tesla.com" },
  NVDA: { name: "NVIDIA Corporation", url: "https://www.nvidia.com" },
  META: { name: "Meta Platforms Inc.", url: "https://about.meta.com" },
  AVGO: { name: "Broadcom Inc.", url: "https://www.broadcom.com" },
  COST: { name: "Costco Wholesale Corporation", url: "https://www.costco.com" },
  NFLX: { name: "Netflix Inc.", url: "https://www.netflix.com" }
};

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem("darkMode") === "enabled") document.body.classList.add("dark-mode");

  updateTopNasdaqStocks(); // Update Top 10 Nasdaq stocks
  setInterval(fetchMarketDecision, 5000); // Update market decision every 5 seconds
});

// Fetch stock data
async function fetchStockData(symbol) {
  try {
    const response = await fetch(`${API_URL}${symbol}&token=${API_KEY}`);
    if (!response.ok) throw new Error(`Failed to fetch data for ${symbol}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Update Top 10 Nasdaq Stocks
async function updateTopNasdaqStocks() {
  const container = document.getElementById("stocks-container");
  container.innerHTML = ""; // Clear the container

  for (let symbol of symbols) {
    const stock = await fetchStockData(symbol);
    if (stock) appendStockCard(container, stock, symbol);
  }
}

// Append Stock Card
function appendStockCard(container, stock, symbol) {
  const { c: currentPrice, d: priceChange, dp: percentChange } = stock;
  const backgroundColor = priceChange >= 0 ? 'green' : 'red';

  const stockCard = document.createElement("div");
  stockCard.classList.add("col-lg-14", "col-md-16", "stock-card");

  stockCard.innerHTML = `
    <h5><a href="${companyNames[symbol].url}" target="_blank">${companyNames[symbol].name}</a></h5>
    <p><strong>Price:</strong> $${currentPrice.toFixed(2)}</p>
    <p class="change" style="background-color: ${backgroundColor};">${percentChange.toFixed(2)}%</p>
  `;
  container.appendChild(stockCard);
}

// Fetch Market Decision (Buy or Sell)
async function fetchMarketDecision() {
  const stockData = await Promise.all(symbols.map(symbol => fetchStockData(symbol)));
  const greenStocks = stockData.filter(stock => stock && stock.d >= 0);
  const redStocks = stockData.filter(stock => stock && stock.d < 0);

  const decision = greenStocks.length > redStocks.length ? "Buy" : "Sell";
  const decisionElement = document.getElementById("market-decision");

  decisionElement.textContent = `Market Decision: ${decision}`;
  changeBackground(decision === "Buy");
}

// Change background color based on market decision
function changeBackground(isBuy) {
  const backgroundColor = isBuy ? "green" : "red";
  document.body.style.transition = "background-color 1s ease";
  document.body.style.backgroundColor = backgroundColor;

  setTimeout(() => {
    document.body.style.backgroundColor = "white"; // Reset background after 30 seconds
  }, 30000);
}



// Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
}

// Append Stock Card
function appendStockCard(container, stock, symbol) {
  const { c: currentPrice, d: priceChange, dp: percentChange } = stock;
  const backgroundColor = priceChange >= 0 ? 'green' : 'red';

  const stockCard = document.createElement("div");
  stockCard.classList.add("col-lg-12", "col-md-6", "stock-card", "text-center");

  stockCard.innerHTML = `
      <h5><a href="${companyNames[symbol].url}" target="_blank">${companyNames[symbol].name}</a></h5>
      <p><strong>Price:</strong> $${currentPrice.toFixed(2)}</p>
      <p class="change" style="background-color: ${backgroundColor};">${percentChange.toFixed(2)}%</p>
  `;
  container.appendChild(stockCard);
}
