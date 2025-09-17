const form = document.getElementById('stockForm');
const quantity = document.getElementById('quantity');
const unitCost = document.getElementById('unitCost');
const totalCostEl = document.getElementById('totalCost');
const calcBtn = document.getElementById('calcBtn');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const toast = document.getElementById('toast');

function formatUGX(n) {
    return 'UGX ' + (isNaN(n) ? 0 : n).toLocaleString('en-UG', { minimumFractionDigits: 2 });
}
function computeTotal() {
    const q = parseFloat(quantity.value) || 0;
    const c = parseFloat(unitCost.value) || 0;
    const total = q * c;
    totalCostEl.textContent = formatUGX(total);
    return total;
}
const stoc1kData = JSON.parse(localStorage.getItem('stock'));
console.log(stockDataData);
calcBtn.addEventListener('click', () => {
    computeTotal();
    showToast('Total cost calculated.');
});
[quantity, unitCost].forEach(inp => inp.addEventListener('input', computeTotal));

function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2800);
}

function getFormData() {
    return {
        id: 'mayondo_' + Date.now(),
        productName: document.getElementById('productName').value.trim(),
        productType: document.getElementById('productType').value,
        supplierName: document.getElementById('supplierName').value.trim(),
        dateReceived: document.getElementById('dateReceived').value,
        quantity: Number(document.getElementById('quantity').value) || 0,
        unitCost: Number(document.getElementById('unitCost').value) || 0,
        unitPrice: Number(document.getElementById('unitPrice').value) || 0,
        totalCost: computeTotal(),
        quality: document.getElementById('quality').value.trim(),
        color: document.getElementById('color').value.trim(),
        measurements: document.getElementById('measurements').value.trim(),
        storage: document.getElementById('storage').value,
        remarks: document.getElementById('remarks').value.trim(),
        recordedBy: document.getElementById('recordedBy').value.trim(),
        approvedBy: document.getElementById('approvedBy').value.trim(),
        createdAt: new Date().toISOString()
    };
}

const stockData = JSON.parse(localStorage.getItem('stock'));
console.log(stockDataData);

function validateRequired() {
    const required = ['productName', 'productType', 'supplierName', 'dateReceived', 'quantity', 'unitCost', 'unitPrice', 'quality', 'storage', 'recordedBy', 'approvedBy'];
    return required.every(id => {
        const el = document.getElementById(id);
        return el && el.value.trim() !== '';
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateRequired()) {
        showToast('Please fill all required fields (marked *).');
        return;
    }
    const entry = getFormData();
    try {
        const key = 'mayondo_stock_entries_v1';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(entry);
        localStorage.setItem(key, JSON.stringify(existing));
        showToast('Stock entry saved locally.');
    } catch (err) {
        console.error(err);
        showToast('Failed to save locally.');
    }
});

resetBtn.addEventListener('click', () => {
    if (confirm('Reset the form?')) {
        form.reset();
        totalCostEl.textContent = formatUGX(0);
    }
});

exportBtn.addEventListener('click', () => {
    const key = 'mayondo_stock_entries_v1';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    if (existing.length === 0) { showToast('No entries to export.'); return; }
    const last = existing[existing.length - 1];
    const blob = new Blob([JSON.stringify(last, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = last.id + '.json'; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    showToast('Last entry exported as JSON.');
});

// Auto-set today's date
(function () {
    const today = new Date().toISOString().slice(0, 10);
    const dr = document.getElementById('dateReceived');
    if (dr && !dr.value) dr.value = today;
})();
