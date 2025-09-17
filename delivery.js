const basePriceInput = document.getElementById("basePrice");
const transportCheckbox = document.getElementById("transport");
const totalPriceEl = document.getElementById("totalPrice");

function calculateTotal() {
    let price = parseFloat(basePriceInput.value) || 0;
    if (transportCheckbox.checked) {
        price = price * 1.05;
    }
    totalPriceEl.textContent = "Total: " + price.toFixed(2);
    return price;
}

basePriceInput.addEventListener("input", calculateTotal);
transportCheckbox.addEventListener("change", calculateTotal);

function processDelivery() {
    const name = document.getElementById("customerName").value;
    const address = document.getElementById("customerAddress").value;
    const product = document.getElementById("productName").value;
    const qty = document.getElementById("quantity").value;
    const payment = document.getElementById("paymentType").value;
    const status = document.getElementById("deliveryStatus").value;
    const total = calculateTotal();

    if (!name || !address || !product || !qty || !payment) {
        document.getElementById("statusMessage").textContent = "⚠️ Please fill in all fields.";
        return;
    }

    document.getElementById("statusMessage").textContent =
        `✅ Delivery saved for ${name}. Product: ${qty} x ${product}. Payment: ${payment}. Total: ${total.toFixed(2)}. Status: ${status}`;
}
