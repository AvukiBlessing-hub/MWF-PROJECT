// Pie Chart: Most Sold Products
const pieCtx = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    datasets: [{
      label: 'Most Sold Products',
      data: [50, 30, 20, 15],
      backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0'],
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});

// Line Chart: Daily Sales Revenue
const lineCtx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(lineCtx, {
  type: 'line',
  data: {
    labels: ['01/10','02/10','03/10','04/10','05/10'],
    datasets: [{
      label: 'Daily Sales Revenue',
      data: [100000, 120000, 90000, 150000, 110000],
      borderColor: 'rgba(75,192,192,1)',
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});
