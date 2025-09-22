// Example stock data (replace with dynamic data later)
const stockData = [
  {
    productName: 'Sofa',
    productType: 'Furniture',
    quantity: 10,
    quality: 'High',
    unitCostPrice: 200,
    unitSellingPrice: 250,
    supplierName: 'WoodWorks Ltd',
    dateReceived: '2025-09-19'
  },
  {
    productName: 'Timber',
    productType: 'Wood',
    quantity: 50,
    quality: 'Medium',
    unitCostPrice: 50,
    unitSellingPrice: 70,
    supplierName: 'Upcountry Suppliers',
    dateReceived: '2025-09-18'
  }
];

const tbody = document.querySelector('#stockTable tbody');

function renderTable(data) {
  tbody.innerHTML = ''; // clear previous rows
  data.forEach(item => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td data-label="Product Name">${item.productName}</td>
      <td data-label="Product Type">${item.productType}</td>
      <td data-label="Quantity">${item.quantity}</td>
      <td data-label="Quality">${item.quality}</td>
      <td data-label="Unit Cost Price">${item.unitCostPrice}</td>
      <td data-label="Unit Selling Price">${item.unitSellingPrice}</td>
      <td data-label="Supplier Name">${item.supplierName}</td>
      <td data-label="Date Received">${item.dateReceived}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Initial render
renderTable(stockData);
