(function () {
  'use strict';

  console.log('Sales Script: Loading...');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('Sales: Initializing...');
    try {
      loadStockOverview();
      setupQuantityValidation();
      setupProductTypeFilter();
      setupSalesDataLoader();
      console.log('Sales: Initialization complete');
    } catch (error) {
      console.error('Sales Init Error:', error);
    }
  }

  /* ---------------- STOCK OVERVIEW ---------------- */
  function loadStockOverview() {
    const productSelect = document.getElementById('stockId');
    if (!productSelect) return;

    fetch('/api/stocklist')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch stock'))
      .then(stockItems => {
        const overviewData = generateStockOverviewData(stockItems);
        window.stockOverviewData = overviewData;
        populateProductDropdown(overviewData);
      })
      .catch(err => {
        console.error('Error loading stock:', err);
        productSelect.innerHTML = '<option value="">Unable to load products</option>';
      });
  }

  function generateStockOverviewData(stockItems) {
    const stockData = {};
    stockItems.forEach(item => {
      const { productName, productType } = item;
      const quantity = Number(item.totalQuantity) || 0;
      if (!productName || quantity === 0) return;
      const key = `${productName}|||${productType}`;
      if (stockData[key]) stockData[key].quantity += quantity;
      else stockData[key] = { productName, productType, quantity };
    });
    return Object.values(stockData).sort((a, b) =>
      a.productName.localeCompare(b.productName) || a.productType.localeCompare(b.productType)
    );
  }

  function populateProductDropdown(overviewData, filterType) {
    const select = document.getElementById('stockId');
    if (!select) return;
    select.innerHTML = '<option value="">-- Select Product --</option>';
    let filtered = overviewData;
    if (filterType) filtered = overviewData.filter(i => i.productType.toLowerCase() === filterType.toLowerCase());
    if (filtered.length === 0) {
      select.innerHTML = '<option value="">No stock available</option>';
      return;
    }
    filtered.forEach(item => {
      const opt = document.createElement('option');
      opt.value = `${item.productName}|||${item.productType}`;
      opt.dataset.quantity = item.quantity;
      opt.textContent = `${item.productName} (${item.productType}) - Available: ${item.quantity} ${getStockLevelIndicator(item.quantity)}`;
      select.appendChild(opt);
    });
  }

  function getStockLevelIndicator(quantity) {
    if (quantity > 50) return '✓';
    if (quantity > 20) return '⚠️';
    return '🔴';
  }

  function setupProductTypeFilter() {
    const select = document.getElementById('productType');
    if (!select) return;
    select.addEventListener('change', () => {
      const type = select.value;
      if (window.stockOverviewData) populateProductDropdown(window.stockOverviewData, type);
    });
  }

  function setupQuantityValidation() {
    const qty = document.getElementById('quantity');
    const product = document.getElementById('stockId');
    if (!qty || !product) return;

    qty.addEventListener('input', validateQuantity);
    product.addEventListener('change', () => {
      qty.value = '';
      qty.setCustomValidity('');
    });
  }

  function validateQuantity() {
    const qty = document.getElementById('quantity');
    const product = document.getElementById('stockId');
    if (!qty || !product) return;

    const opt = product.options[product.selectedIndex];
    if (!opt || !opt.dataset.quantity) return;

    const available = parseInt(opt.dataset.quantity);
    const requested = parseInt(qty.value);
    if (requested > available) {
      qty.setCustomValidity(`Only ${available} units available in stock`);
      qty.reportValidity();
    } else {
      qty.setCustomValidity('');
    }
  }

  /* ---------------- SALES TABLE FILTER ---------------- */
  window.filterSalesTable = function () {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase().trim();
    const table = document.getElementById('salesTable');
    const tbody = table.querySelector('tbody');
    const rows = tbody.getElementsByTagName('tr');
    const noResultsMsg = document.getElementById('noResultsMessage');

    let visibleCount = 0;
    let totalQty = 0, totalCost = 0, totalPrice = 0;

    for (let row of rows) {
      if (row.id === 'noSalesRow') continue;
      const cells = row.getElementsByTagName('td');
      if (!cells.length) continue;

      const [customer, type, name, , , , , agent, total] = Array.from(cells).map(td => td.textContent.toLowerCase());
      const match = [customer, type, name, agent].some(field => field.includes(filter));

      if (match) {
        row.style.display = '';
        visibleCount++;
        totalQty += parseFloat(cells[3].textContent) || 0;
        totalCost += parseFloat(cells[5].textContent) || 0;
        totalPrice += parseFloat(cells[8].textContent) || 0;
      } else {
        row.style.display = 'none';
      }
    }

    document.getElementById('totalQuantity').textContent = totalQty;
    document.getElementById('totalCostPrice').textContent = totalCost.toFixed(2);
    document.getElementById('totalTotalPrice').textContent = totalPrice.toFixed(2);

    if (noResultsMsg) noResultsMsg.style.display = visibleCount === 0 && filter !== '' ? 'block' : 'none';
  };

  /* ---------------- GENERATE REPORT ---------------- */
  window.generateSaleReport = function (event, saleId, customerName) {
    const row = event.target.closest('tr');
    const cells = row.querySelectorAll('td');
    const data = [{
      customerName: cells[0].textContent,
      productType: cells[1].textContent,
      productName: cells[2].textContent,
      quantity: cells[3].textContent,
      quality: cells[4].textContent,
      costPrice: cells[5].textContent,
      transport: cells[6].textContent,
      agent: cells[7].textContent,
      totalPrice: cells[8].textContent
    }];
    printSalesReport(data, `Sales Report - ${customerName}`);
  };

  window.generateFullSalesReport = function () {
    const rows = document.querySelectorAll('#salesTable tbody tr');
    const data = [];
    rows.forEach(row => {
      if (row.style.display !== 'none' && row.id !== 'noSalesRow') {
        const cells = row.querySelectorAll('td');
        if (cells.length > 1) {
          data.push({
            customerName: cells[0].textContent,
            productType: cells[1].textContent,
            productName: cells[2].textContent,
            quantity: cells[3].textContent,
            quality: cells[4].textContent,
            costPrice: cells[5].textContent,
            transport: cells[6].textContent,
            agent: cells[7].textContent,
            totalPrice: cells[8].textContent
          });
        }
      }
    });

    const totals = {
      quantity: document.getElementById('totalQuantity').textContent,
      costPrice: document.getElementById('totalCostPrice').textContent,
      totalPrice: document.getElementById('totalTotalPrice').textContent
    };
    printSalesReport(data, 'Complete Sales Report', totals);
  };

  function printSalesReport(data, title, totals = null) {
    const printWindow = window.open('', '', 'width=900,height=650');
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;}
          body{font-family:Arial,sans-serif;padding:25px;background:#fff;}
          .report-header{text-align:center;margin-bottom:25px;border-bottom:3px solid #000;padding-bottom:12px;}
          .report-header h1{font-size:22px;text-transform:uppercase;}
          .report-header p{color:#555;font-size:12px;}
          table{width:100%;border-collapse:collapse;margin-top:15px;}
          th,td{border:1px solid #000;padding:8px;font-size:11px;}
          th{background:#000;color:#fff;text-transform:uppercase;}
          tr:nth-child(even){background:#f5f5f5;}
          .total-row{background:#000!important;color:#fff;font-weight:bold;}
          .footer{margin-top:30px;text-align:center;font-size:10px;color:#888;}
          @media print{.no-print{display:none;}}
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer</th><th>Product Type</th><th>Product Name</th>
              <th>Quantity</th><th>Quality</th><th>Cost Price</th>
              <th>Transport</th><th>Sales Agent</th><th>Total Price</th>
            </tr>
          </thead>
          <tbody>`;

    data.forEach(i => {
      html += `<tr>
        <td>${i.customerName}</td><td>${i.productType}</td><td>${i.productName}</td>
        <td>${i.quantity}</td><td>${i.quality}</td><td>${i.costPrice}</td>
        <td>${i.transport}</td><td>${i.agent}</td><td>${i.totalPrice}</td>
      </tr>`;
    });

    if (totals) {
      html += `<tr class="total-row">
        <td colspan="3" style="text-align:right;"><strong>TOTALS:</strong></td>
        <td><strong>${totals.quantity}</strong></td><td></td>
        <td><strong>${totals.costPrice}</strong></td><td></td><td></td>
        <td><strong>${totals.totalPrice}</strong></td>
      </tr>`;
    }

    html += `</tbody></table>
      <div class="footer"><p>This is an automated sales report. For queries, contact your administrator.</p></div>
      <div class="no-print" style="text-align:center;margin-top:25px;">
        <button onclick="window.print()" style="padding:8px 18px;background:#000;color:#fff;border:none;border-radius:5px;margin-right:8px;">Print Report</button>
        <button onclick="window.close()" style="padding:8px 18px;background:#666;color:#fff;border:none;border-radius:5px;">Close</button>
      </div>
    </body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
  }

  function setupSalesDataLoader() {
    console.log('Sales table ready. Backend loader ready.');
  }

  console.log('Sales Script: Loaded ✅');

})();

// Confirm delete
function confirmDelete(event) {
  if (!confirm("Are you sure you want to delete this sale?")) {
    event.preventDefault();
    return false;
  }
  return true;
}
