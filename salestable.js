function calculateTotal(row) {
  const quantity = row.querySelector('.quantity').value;
  const cost = row.querySelector('.cost').value;
  const total = row.querySelector('.total');
  total.value = (quantity && cost) ? (quantity * cost).toFixed(2) : '';
}

document.getElementById('salesTable').addEventListener('input', function(e) {
  if (e.target.classList.contains('quantity') || e.target.classList.contains('cost')) {
    const row = e.target.closest('tr');
    calculateTotal(row);
  }
});

document.getElementById('addRowBtn').addEventListener('click', function() {
  const table = document.getElementById('salesTable').querySelector('tbody');
  const newRow = table.rows[0].cloneNode(true);
  newRow.querySelectorAll('input').forEach(input => input.value = '');
  table.appendChild(newRow);
});
