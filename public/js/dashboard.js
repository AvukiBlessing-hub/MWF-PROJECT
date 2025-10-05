document.addEventListener("DOMContentLoaded", function () {
  // Parse data injected from backend
  const pieLabels = JSON.parse(document.getElementById("pieChart").dataset.labels || "[]");
  const pieData = JSON.parse(document.getElementById("pieChart").dataset.data || "[]");
  const salesTrendLabels = JSON.parse(document.getElementById("lineChart").dataset.labels || "[]");
  const salesTrendData = JSON.parse(document.getElementById("lineChart").dataset.data || "[]");

  // === Pie Chart: Most Sold Products ===
  if (pieLabels.length && pieData.length) {
    new Chart(document.getElementById("pieChart"), {
      type: "pie",
      data: {
        labels: pieLabels,
        datasets: [{
          data: pieData,
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
          ],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  }

  // === Line Chart: Daily Sales Revenue ===
  if (salesTrendLabels.length && salesTrendData.length) {
    new Chart(document.getElementById("lineChart"), {
      type: "line",
      data: {
        labels: salesTrendLabels,
        datasets: [{
          label: "Revenue per Day ($)",
          data: salesTrendData,
          borderColor: "blue",
          backgroundColor: "rgba(54,162,235,0.2)",
          fill: true,
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
});
