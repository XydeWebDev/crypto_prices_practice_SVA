function fetchPrices() {
  const coins = [
    { symbol: 'BTC', decimalLimit: 2 },
    { symbol: 'ETH', decimalLimit: 2 },
    { symbol: 'BNB', decimalLimit: 2 },
    { symbol: 'ADA', decimalLimit: 5 },
    { symbol: 'SOL', decimalLimit: 2 },
    { symbol: 'MATIC', decimalLimit: 5 },
    { symbol: 'LTC', decimalLimit: 2 },
    { symbol: 'ETC', decimalLimit: 2 },
    { symbol: 'DOGE', decimalLimit: 5 },
    { symbol: 'TRX', decimalLimit: 5 },
    { symbol: 'EOS', decimalLimit: 5 },
    { symbol: 'XMR', decimalLimit: 2 }
  ];
  fetch('https://api.coincap.io/v2/assets')
    .then(response => response.json())
    .then(data => {
      coins.forEach(coin => {
        const priceElement = document.getElementById(`${coin.symbol.toLowerCase()}-price`);
        const percentElement = document.getElementById(`${coin.symbol.toLowerCase()}-percent`);

        const currentPrice = parseFloat(priceElement.textContent.replace(/\$|\s/g, '').replace(',', '.'));
        const newPrice = parseFloat(data.data.find(asset => asset.symbol === coin.symbol).priceUsd);
        const percent = parseFloat(data.data.find(asset => asset.symbol === coin.symbol).changePercent24Hr).toFixed(2);
        const newRoundedPrice = parseFloat(newPrice.toFixed(coin.decimalLimit));
        const formattedPrice = newRoundedPrice.toLocaleString(undefined, { minimumFractionDigits: coin.decimalLimit, maximumFractionDigits: coin.decimalLimit });
        
        document.getElementById(`${coin.symbol.toLowerCase()}-price`).textContent = `$${formattedPrice}`;
        document.getElementById(`${coin.symbol.toLowerCase()}-percent`).textContent = `${percent}%`;

        if (coin.symbol === 'BTC') {
            console.log('currentPrice:', currentPrice);
            console.log('newPrice:', newRoundedPrice);
        }

        if (newRoundedPrice > currentPrice) {
            priceElement.classList.remove('decrease');
            priceElement.classList.add('increase');
        } else if (newRoundedPrice < currentPrice) {
            priceElement.classList.remove('increase');
            priceElement.classList.add('decrease');
        } else {
            priceElement.classList.remove('increase', 'decrease');
        }

        if (percent > 0) {
            percentElement.classList.add('positive');
        } else if (percent < 0) {
            percentElement.classList.add('negative');
        }
      });
    })
    .catch(error => {
      console.log('Error:', error);
    });
}
setInterval(fetchPrices, 10000);
fetchPrices();