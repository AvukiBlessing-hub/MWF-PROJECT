// Local storage helpers
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function loadData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Toggle theme
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};

// ===== STOCK MANAGEMENT =====
const stockForm = document.getElementById("stockForm");
const stockTable = document.querySelector("#stockTable tbody");
const salesProduct = document.getElementById("salesProduct");
let stock = loadData("stock");

function renderStock() {
  stockTable.innerHTML = "";
  salesProduct.innerHTML = "";
  stock.forEach((item, i) => {
    // Stock table
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td><td>${item.type}</td><td>${item.cost}</td>
      <td>${item.price}</td><td>${item.quantity}</td><td>${item.supplier}</td>
      <td>${item.color || "-"}</td><td>${item.measurements || "-"}</td>
      <td><button onclick="deleteStock(${i})">Delete</button></td>
    `;
    stockTable.appendChild(row);

    // Sales product dropdown
    let opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${item.name} (${item.quantity} available)`;
    salesProduct.appendChild(opt);
  });
  saveData("stock", stock);
}

function deleteStock(index) {
  stock.splice(index, 1);
  renderStock();
}

stockForm.onsubmit = e => {
  e.preventDefault();
  const newItem = {
    name: document.getElementById("productName").value,
    type: document.getElementById("productType").value,
    cost: +document.getElementById("costPrice").value,
    price: +document.getElementById("sellingPrice").value,
    quantity: +document.getElementById("quantity").value,
    supplier: document.getElementById("supplierName").value,
    color: document.getElementById("color").value,
    measurements: document.getElementById("measurements").value,
  };
  stock.push(newItem);
  renderStock();
  stockForm.reset();
};

renderStock();

// ===== SALES =====
const salesForm = document.getElementById("salesForm");
const salesTable = document.querySelector("#salesTable tbody");
const receiptDiv = document.getElementById("receipt");
let sales = loadData("sales");

function renderSales() {
  salesTable.innerHTML = "";
  sales.forEach(sale => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${sale.customer}</td><td>${sale.product}</td>
      <td>${sale.quantity}</td><td>${sale.total.toFixed(2)}</td>
      <td>${sale.payment}</td><td>${sale.agent}</td><td>${sale.date}</td>
    `;
    salesTable.appendChild(row);
  });
  saveData("sales", sales);
}

salesForm.onsubmit = e => {
  e.preventDefault();
  let productIndex = salesProduct.value;
  let item = stock[productIndex];
  let qty = +document.getElementById("salesQuantity").value;

  if (qty > item.quantity) {
    alert("Not enough stock!");
    return;
  }

  let total = qty * item.price;
  if (document.getElementById("transport").checked) {
    total *= 1.05; // +5%
  }

  let sale = {
    customer: document.getElementById("customerName").value,
    product: item.name,
    quantity: qty,
    total,
    payment: document.getElementById("paymentType").value,
    agent: document.getElementById("salesAgent").value,
    date: new Date().toLocaleString(),
  };
  sales.push(sale);
  item.quantity -= qty;
  renderStock();
  renderSales();

  // Print receipt
  receiptDiv.innerHTML = `
    <h3>Receipt</h3>
    <p>Customer: ${sale.customer}</p>
    <p>Product: ${sale.product} (x${sale.quantity})</p>
    <p>Total: ${sale.total.toFixed(2)}</p>
    <p>Payment: ${sale.payment}</p>
    <p>Agent: ${sale.agent}</p>
    <p>Date: ${sale.date}</p>
  `;
  salesForm.reset();
};

renderSales();

// ===== REPORTS =====
const reportOutput = document.getElementById("reportOutput");
document.getElementById("generateStockReport").onclick = () => {
  let html = "<h3>Stock Report</h3><ul>";
  stock.forEach(item => {
    html += `<li>${item.name} - Qty: ${item.quantity}, Price: ${item.price}</li>`;
  });
  html += "</ul>";
  reportOutput.innerHTML = html;
};

document.getElementById("generateSalesReport").onclick = () => {
  let totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  let html = "<h3>Sales Report</h3><ul>";
  sales.forEach(s => {
    html += `<li>${s.customer} bought ${s.product} x${s.quantity} = ${s.total.toFixed(2)}</li>`;
  });
  html += `</ul><p><b>Total Sales: ${totalSales.toFixed(2)}</b></p>`;
  reportOutput.innerHTML = html;
};

// ===== EXPORT TO CSV =====
function exportCSV(data, filename) {
  const csv = [Object.keys(data[0]).join(","), ...data.map(d => Object.values(d).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

document.getElementById("exportStock").onclick = () => {
  if (stock.length) exportCSV(stock, "stock.csv");
};
document.getElementById("exportSales").onclick = () => {
  if (sales.length) exportCSV(sales, "sales.csv");
};
