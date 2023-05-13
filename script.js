function fetchPrices() {
    const coins = [
        { symbol: 'BTC', decimalLimit: 2 },
        { symbol: 'ETH', decimalLimit: 2 },
        { symbol: 'LTC', decimalLimit: 2 },
        { symbol: 'BNB', decimalLimit: 2 },
        { symbol: 'ADA', decimalLimit: 4 },
        { symbol: 'SOL', decimalLimit: 2 },
        { symbol: 'TRX', decimalLimit: 4 },
        { symbol: 'EOS', decimalLimit: 4 },
        { symbol: 'MATIC', decimalLimit: 4 },
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
                percentElement.classList.remove('negative');
                percentElement.classList.add('positive');
            } else if (percent < 0) {
                percentElement.classList.remove('positive');
                percentElement.classList.add('negative');
            } else {
                percentElement.classList.remove('positive', 'negative');
            }
        });
    })
    .catch(error => {
        console.log('Error:', error);
    });
}


setInterval(fetchPrices, 10000);
fetchPrices();


async function getCoinPriceData(id) {
    try {
        const response = await fetch(`https://api.coincap.io/v2/assets/${id}/history?interval=m15`);
        const data = await response.json();
        const priceData = data.data.map(item => ({
            price: item.priceUsd,
            date: new Date(item.time).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})
        }));
        return priceData;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Создание графика цены
async function createCoinChart() {
    const coins = ['BTC', 'ETH', 'LTC', 'BNB', 'ADA', 'SOL', 'TRX', 'EOS', 'MATIC', 'XMR'];
    const response = await fetch('https://api.coincap.io/v2/assets');
    const data = await response.json();
    coins.forEach(async (coin) => {
        const coinId = data.data.find(asset => asset.symbol === coin).id;
        const coinPrices = await getCoinPriceData(coinId);
        const coinDates = coinPrices.map(priceData => priceData.date);

        const firstPrice = coinPrices[0].price;
        const lastPrice = coinPrices[coinPrices.length - 1].price;
        let lineColor = '#00FF00';
        if (firstPrice > lastPrice) {
            lineColor = '#FF0000';
        }

        const ctx = document.getElementById(`${coin.toLowerCase()}-chart`);
        console.log(ctx);
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: coinDates,
                datasets: [{
                    label: 'Coin Price',
                    data: coinPrices.map(priceData => priceData.price),
                    borderColor: lineColor,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderWidth: 3,
                    tension: 0.5
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                }
            }
        });
    })
}


window.onload = createCoinChart;