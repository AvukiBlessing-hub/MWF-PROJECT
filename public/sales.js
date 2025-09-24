// Get references to elements
const productTypeEl = document.getElementById("productType");
const productNameEl = document.getElementById("productName");
const quantityEl = document.getElementById("quantity");
const costPriceEl = document.getElementById("costPrice");
const transportEl = document.getElementById("transport");
const totalPriceEl = document.getElementById("totalPrice");

// Product options
const products = {
    wood: ["Timber", "Poles", "Hardwood", "Softwood"],
    furniture: ["Beds", "Sofas", "Dining Tables", "Cupboards", "Drawers", "Office Furniture"]
};

// Update product dropdown based on type
productTypeEl.addEventListener("change", () => {
    const type = productTypeEl.value;
    productNameEl.innerHTML = '<option value="">-- Select Product --</option>';
    if (products[type]) {
        products[type].forEach(p => {
            const option = document.createElement("option");
            option.value = p.toLowerCase().replace(/\s+/g, "-");
            option.textContent = p;
            productNameEl.appendChild(option);
        });
    }
});

// Calculate total price
function calculateTotal() {
    const qty = parseFloat(quantityEl.value) || 0;
    const cost = parseFloat(costPriceEl.value) || 0;
    let total = qty * cost;

    // Add 5% transport fee if checked
    if (transportEl.checked) {
        total *= 1.05;
    }

    // Update total input
    totalPriceEl.value = total.toFixed(2);
}

// Add event listeners
quantityEl.addEventListener("input", calculateTotal);
costPriceEl.addEventListener("input", calculateTotal);
transportEl.addEventListener("change", calculateTotal);
