// reports.js - Backend-ready, no dummy data

// Get references to KPI elements
const totalSalesEl = document.getElementById('total-sales');
const transportRevenueEl = document.getElementById('transport-revenue');
const lowStockEl = document.getElementById('low-stock');

// Tables
const salesTableBody = document.querySelector('#sales-table tbody');
const stockTableBody = document.querySelector('#stock-table tbody');

// Function to populate KPI (to be called after fetching from backend)
function updateKPIs({ totalSales, transportRevenue, lowStockCount }) {
    totalSalesEl.textContent = `UGX ${totalSales.toLocaleString()}`;
    transportRevenueEl.textContent = `UGX ${transportRevenue.toLocaleString()}`;
    lowStockEl.textContent = lowStockCount;
}

// Function to populate sales table
function populateSalesTable(sales) {
    salesTableBody.innerHTML = '';
    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.customer}</td>
            <td>${sale.product}</td>
            <td>${sale.quantity}</td>
            <td>UGX ${sale.unitPrice.toLocaleString()}</td>
            <td>UGX ${sale.total.toLocaleString()}</td>
            <td>${sale.paymentType}</td>
            <td>${sale.salesAgent}</td>
            <td>${sale.transport ? 'Yes' : 'No'}</td>
        `;
        salesTableBody.appendChild(row);
    });
}

// Function to populate stock table
function populateStockTable(stock) {
    stockTableBody.innerHTML = '';
    stock.forEach(item => {
        const row = document.createElement('tr');
        if (item.quantity < 10) row.classList.add('low-stock');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>UGX ${item.cost.toLocaleString()}</td>
            <td>UGX ${item.price.toLocaleString()}</td>
        `;
        stockTableBody.appendChild(row);
    });
}

// Filter button handler (will fetch data from backend in real system)
document.getElementById('apply-filters').addEventListener('click', () => {
    // Example: fetchReports({ from: ..., to: ..., paymentType: ..., salesAgent: ... });
    console.log('Filters applied! Backend fetch to be implemented.');
});

// Example usage:
// updateKPIs({ totalSales: 0, transportRevenue: 0, lowStockCount: 0 });
// populateSalesTable([]);
// populateStockTable([]);
