// Sample sales data (replace with data from your sales page dynamically)

let salesData = [
    { date: '2025-09-01', amount: 200 },
    { date: '2025-09-02', amount: 450 },
    { date: '2025-09-03', amount: 300 },
];


//  load data


// Sample stock data (replace with your stock page dynamically)
let stock1Data = [
    { product: 'Bed', type: 'Furniture', quality: 'High', quantity: 10, cost: 150 },
    { product: 'Sofa', type: 'Furniture', quality: 'Medium', quantity: 5, cost: 250 },
    { product: 'Table', type: 'Furniture', quality: 'High', quantity: 8, cost: 100 },
];

// Function to calculate total sales
function updateTotalSales() {
    let total = salesData.reduce((sum, sale) => sum + sale.amount, 0);
    document.getElementById('totalSales').innerText = `$${total}`;
}

// Function to calculate total stock
function updateTotalStock() {
    let totalQty = stockData.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('totalStock').innerText = totalQty;
}

// Populate stock table
function populateStockTable() {
    const tbody = document.getElementById('stockTable').querySelector('tbody');
    tbody.innerHTML = '';
    stockData.forEach(item => {
        let row = `<tr>
            <td>${item.product}</td>
            <td>${item.type}</td>
            <td>${item.quality}</td>
            <td>${item.quantity}</td>
            <td>$${item.cost}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Setup sales chart using Chart.js
const ctx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: salesData.map(s => s.date),
        datasets: [{
            label: 'Sales Amount ($)',
            data: salesData.map(s => s.amount),
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// Function to update dashboard dynamically
function updateDashboard() {
    updateTotalSales();
    updateTotalStock();
    populateStockTable();
    salesChart.data.labels = salesData.map(s => s.date);
    salesChart.data.datasets[0].data = salesData.map(s => s.amount);
    salesChart.update();
}

// Initial load
updateDashboard();

// Example: dynamically adding a new sale
// salesData.push({ date: '2025-09-04', amount: 500 });
// updateDashboard();
