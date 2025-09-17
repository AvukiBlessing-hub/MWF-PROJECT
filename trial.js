// dashboard.js - Backend-ready, no dummy data

// KPI Elements
const totalSalesEl = document.getElementById('total-sales');
const totalStockEl = document.getElementById('total-stock');
const lowStockEl = document.getElementById('low-stock');
const pendingDeliveriesEl = document.getElementById('pending-deliveries');

// Recent Activity Table
const activityTableBody = document.querySelector('#activity-table tbody');

// Function to update KPIs from backend
function updateKPIs({ totalSales, totalStock, lowStockCount, pendingDeliveries }) {
    totalSalesEl.textContent = `UGX ${totalSales.toLocaleString()}`;
    totalStockEl.textContent = totalStock;
    lowStockEl.textContent = lowStockCount;
    pendingDeliveriesEl.textContent = pendingDeliveries;
}

// Function to populate recent activity
function populateRecentActivity(activities) {
    activityTableBody.innerHTML = '';
    activities.forEach(act => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${act.date}</td>
            <td>${act.action}</td>
            <td>${act.user}</td>
            <td>${act.details}</td>
        `;
        activityTableBody.appendChild(row);
    });
}

// Quick links navigation (to be linked to actual pages)
document.getElementById('sales-page').addEventListener('click', () => {
    window.location.href = 'sales.htm';
});
document.getElementById('stock-page').addEventListener('click', () => {
    window.location.href = 'stock.htm';
});
document.getElementById('reports-page').addEventListener('click', () => {
    window.location.href = 'reports.htm';
});

// Example usage when backend is ready:
// updateKPIs({ totalSales: 0, totalStock: 0, lowStockCount: 0, pendingDeliveries: 0 });
// populateRecentActivity([]);
