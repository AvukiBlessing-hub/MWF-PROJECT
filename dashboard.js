const apiBase = '/api'; // adjust if needed

async function fetchData(endpoint) {
  try {
    const res = await fetch(apiBase + endpoint);
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (e) {
    console.error('Error loading', endpoint, e);
    return [];
  }
}

function renderTable(containerId, data, columns) {
  const container = document.getElementById(containerId);
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="empty">No data available</div>';
    return;
  }
  let html = '<table><thead><tr>';
  columns.forEach(col => html += `<th>${col.title}</th>`);
  html += '</tr></thead><tbody>';
  data.forEach(row => {
    html += '<tr>';
    columns.forEach(col => {
      const value = row[col.key] || '';
      html += `<td>${value}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

async function loadDashboard() {
  // Metrics
  const metrics = await fetchData('/metrics');
  document.getElementById('stockValue').textContent =
    metrics.totalStockValue ? `UGX ${metrics.totalStockValue}` : '—';
  document.getElementById('salesToday').textContent =
    metrics.totalSalesToday ? `UGX ${metrics.totalSalesToday}` : '—';
  document.getElementById('pendingDeliveries').textContent =
    metrics.pendingDeliveries ?? '—';
  document.getElementById('lowStock').textContent =
    metrics.lowStockCount ?? '—';

  // Sales
  const sales = await fetchData('/sales');
  renderTable('salesTable', sales, [
    {key: 'date', title: 'Date'},
    {key: 'customerName', title: 'Customer'},
    {key: 'productName', title: 'Product'},
    {key: 'quantity', title: 'Qty'},
    {key: 'totalPrice', title: 'Total'},
    {key: 'paymentType', title: 'Payment'},
    {key: 'salesAgent', title: 'Agent'}
  ]);

  // Stock
  const stock = await fetchData('/stock');
  renderTable('stockTable', stock, [
    {key: 'productName', title: 'Product'},
    {key: 'productType', title: 'Type'},
    {key: 'quantity', title: 'Qty'},
    {key: 'costPrice', title: 'Cost'},
    {key: 'productPrice', title: 'Price'},
    {key: 'supplierName', title: 'Supplier'}
  ]);

  // Deliveries
  const deliveries = await fetchData('/deliveries');
  renderTable('deliveryTable', deliveries, [
    {key: 'scheduledAt', title: 'Due'},
    {key: 'customerName', title: 'Customer'},
    {key: 'status', title: 'Status'},
    {key: 'assignedTo', title: 'Driver'}
  ]);

  // Receipts
  const receipts = await fetchData('/receipts');
  renderTable('receiptsTable', receipts, [
    {key: 'receiptNo', title: 'Receipt'},
    {key: 'amount', title: 'Amount'},
    {key: 'paymentType', title: 'Payment'},
    {key: 'date', title: 'Date'}
  ]);

  // Reports
  const reports = await fetchData('/reports');
  const reportsDiv = document.getElementById('reportsList');
  if (!reports || reports.length === 0) {
    reportsDiv.innerHTML = '<div class="empty">No reports available</div>';
  } else {
    reportsDiv.innerHTML = reports.map(r =>
      `<div class="card"><strong>${r.name}</strong><br>
      ${r.periodStart} — ${r.periodEnd}<br>
      <a href="${r.url || '#'}">Download</a></div>`
    ).join('');
  }
}

loadDashboard();
