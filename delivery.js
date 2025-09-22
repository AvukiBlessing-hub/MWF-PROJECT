// Get form elements
const basePriceInput = document.getElementById("basePrice");
const quantityInput = document.getElementById("quantity");
const transportCheckbox = document.getElementById("transport");
const totalPriceEl = document.getElementById("totalPrice");
const statusMessage = document.getElementById("statusMessage");

// Auto-calculate total price
function calculateTotal() {
    const basePrice = parseFloat(basePriceInput.value) || 0;
    const quantity = parseInt(quantityInput.value) || 0;
    let total = basePrice * quantity;

    if (transportCheckbox.checked) {
        total = total * 1.05; // add 5%
    }

    totalPriceEl.textContent = "Total: " + total.toFixed(2);
    return total;
}

// Update total when inputs change
basePriceInput.addEventListener("input", calculateTotal);
quantityInput.addEventListener("input", calculateTotal);
transportCheckbox.addEventListener("change", calculateTotal);

// Process delivery (front-end confirmation)
function processDelivery() {
    const name = document.getElementById("customerName").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const product = document.getElementById("productName").value.trim();
    const qty = parseInt(quantityInput.value) || 0;
    const payment = document.getElementById("paymentType").value;
    const status = document.getElementById("deliveryStatus").value;
    const total = calculateTotal();

    if (!name || !address || !product || !qty || !payment) {
        statusMessage.textContent = " Please fill in all fields.";
        return;
    }

    statusMessage.textContent =
        ` Delivery saved for ${name}. Product: ${qty} x ${product}. Payment: ${payment}. Total: ${total.toFixed(2)}. Status: ${status}`;
}
