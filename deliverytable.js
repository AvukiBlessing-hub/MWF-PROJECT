const deliveryTableBody = document.querySelector("#deliveryTable tbody");

// Function to calculate total price
function calculateTotal(basePrice, quantity, transportFee) {
    return basePrice * quantity + transportFee;
}

// Function to add a delivery row
function addDeliveryRow(delivery) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${delivery.customerName}</td>
        <td>${delivery.deliveryAddress}</td>
        <td>${delivery.productName}</td>
        <td>${delivery.quantity}</td>
        <td>${delivery.paymentMethod}</td>
        <td>${delivery.basePrice.toFixed(2)}</td>
        <td>${delivery.transportFee.toFixed(2)}</td>
        <td>${calculateTotal(delivery.basePrice, delivery.quantity, delivery.transportFee).toFixed(2)}</td>
        <td>${delivery.deliveryStatus}</td>
    `;

    deliveryTableBody.appendChild(tr);
}

// Example function to add a sample delivery
function addSampleDelivery() {
    const sample = {
        customerName: "John Doe",
        deliveryAddress: "123 Main Street",
        productName: "Laptop",
        quantity: 2,
        paymentMethod: "cash",
        basePrice: 500,
        transportFee: 25,
        deliveryStatus: "pending"
    };

    addDeliveryRow(sample);
}
