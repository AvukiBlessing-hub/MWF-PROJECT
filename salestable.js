// This file is ready for backend integration.
// For now, it just waits for your data.

document.addEventListener("DOMContentLoaded", () => {
  console.log("Sales table is ready. Fetch data from backend here later.");

  // Example function you can connect to Node.js later
  async function loadSalesData() {
    try {
      // Replace "/api/sales" with your real backend endpoint later
      const response = await fetch("/api/sales");
      const data = await response.json();

      const tableBody = document.querySelector("#salesTable tbody");
      tableBody.innerHTML = "";

      data.forEach(sale => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${sale.productType}</td>
          <td>${sale.productName}</td>
          <td>${sale.quantity}</td>
          <td>${sale.quality}</td>
          <td>$${sale.costPrice.toFixed(2)}</td>
          <td>$${(sale.quantity * sale.costPrice).toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error("Error fetching sales data:", err);
    }
  }

  // You can call loadSalesData() when backend is ready
  // loadSalesData();
});
