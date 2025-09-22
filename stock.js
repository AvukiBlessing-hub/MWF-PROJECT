const form = document.querySelector('form');
const toast = document.createElement('div');
toast.style.position = 'fixed';
toast.style.bottom = '20px';
toast.style.right = '20px';
toast.style.padding = '12px 18px';
toast.style.background = '#fff';
toast.style.border = '1px solid #ccc';
toast.style.borderRadius = '8px';
toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
toast.style.display = 'none';
document.body.appendChild(toast);

function showToast(message) {
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2500);
}

// Simple form validation
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const requiredFields = ['product', 'productType', 'quantity', 'quality', 'price', 'sellingPrice', 'supplier', 'date'];
  let valid = true;

  requiredFields.forEach(id => {
    const field = document.getElementById(id);
    if (!field.value.trim()) valid = false;
  });

  if (!valid) {
    showToast('Please fill all required fields!');
    return;
  }

  showToast('Stock entry added successfully!');
  form.reset();
});

// Auto-set today's date
const dateInput = document.getElementById('date');
if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
