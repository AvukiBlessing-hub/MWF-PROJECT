const form = document.getElementById('salesForm');
const quantityInput = document.getElementById('quantity');
const costInput = document.getElementById('costPrice');
const totalField = document.getElementById('totalAmount');

// Load existing sales or start with empty array
let salesData = JSON.parse(localStorage.getItem('salesData')) || [];

// Auto-calculate total amount
function calculateTotal() {
    const qty = parseFloat(quantityInput.value) || 1;
    const cost = parseFloat(costInput.value) || 0;
    totalField.value = (qty * cost).toFixed(2);
}

// Calculate total whenever quantity or cost changes
quantityInput.addEventListener('input', calculateTotal);
costInput.addEventListener('input', calculateTotal);

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const sale = {
        product: document.getElementById('product').value,
        type: document.getElementById('type').value,
        quality: document.getElementById('quality').value,
        quantity: parseFloat(quantityInput.value),
        costPrice: parseFloat(costInput.value),
        total: parseFloat(totalField.value),
        agent: document.getElementById('agent').value,
        date: new Date().toLocaleString()
    };

    // Save sale
    salesData.push(sale);
    localStorage.setItem('salesData', JSON.stringify(salesData));

    // Optional: Update dashboard counters if dashboard is open in another tab
    window.dispatchEvent(new Event('storage'));

    alert(`Sale Recorded:\n
Product: ${sale.product}
Type: ${sale.type}
Quantity: ${sale.quantity}
Cost Price: ${sale.costPrice}
Total Amount: ${sale.total}
Agent: ${sale.agent}`);

    // Reset form
    form.reset();
    totalField.value = '';
    quantityInput.value = 1; // reset to 1
});
