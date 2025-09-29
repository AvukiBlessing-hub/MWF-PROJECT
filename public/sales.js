// // Get references to elements
// const productTypeEl = document.getElementById("productType");
// const productNameEl = document.getElementById("productName");
// const quantityEl = document.getElementById("quantity");
// const costPriceEl = document.getElementById("costPrice");
// const transportEl = document.getElementById("transportCheck");
// const totalPriceEl = document.getElementById("totalPrice");

// // Product options
// const products = {
//     wood: ["Timber", "Poles", "Hardwood", "Softwood"],
//     furniture: ["Beds", "Sofas", "Dining Tables", "Cupboards", "Drawers", "Office Furniture"]
// };

// // Update product dropdown based on type
// productTypeEl.addEventListener("change", () => {
//     const type = productTypeEl.value;
//     productNameEl.innerHTML = '<option value="">-- Select Product --</option>';
//     if (products[type]) {
//         products[type].forEach(p => {
//             const option = document.createElement("option");
//             option.value = p; // Use exact product name matching backend data
//             option.textContent = p;
//             productNameEl.appendChild(option);
//         });
//     }
//     // Reset other inputs on product type change
//     quantityEl.value = "";
//     costPriceEl.value = "";
//     totalPriceEl.value = "";
// });

// // Calculate total price
// function calculateTotal() {
//     const qty = parseFloat(quantityEl.value) || 0;
//     const cost = parseFloat(costPriceEl.value) || 0;
//     let total = qty * cost;

//     // Add 5% transport fee if checked
//     if (transportEl.checked) {
//         total *= 1.05;
//     }

//     // Update total input
//     if (total > 0) {
//       totalPriceEl.value = total.toFixed(2);
//     } else {
//       totalPriceEl.value = "";
//     }
// }

// // Add event listeners
// quantityEl.addEventListener("input", calculateTotal);
// costPriceEl.addEventListener("input", calculateTotal);
// transportEl.addEventListener("change", calculateTotal);

// // Optional: initial call to set total in case inputs prefilled
// calculateTotal();
