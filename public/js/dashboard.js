document.addEventListener("DOMContentLoaded", function () {
  // === PIE CHART ===
  const pieEl = document.getElementById("pieChart");
  if (pieEl) {
    const pieLabels = JSON.parse(pieEl.dataset.labels || "[]");
    const pieData = JSON.parse(pieEl.dataset.data || "[]");

    new Chart(pieEl, {
      type: "pie",
      data: {
        labels: pieLabels,
        datasets: [{
          data: pieData,
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56",
            "#4BC0C0", "#9966FF", "#FF9F40"
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  // === BAR CHART ===
  const barEl = document.getElementById("lineChart"); // still using id "lineChart"
  if (barEl) {
    const barLabels = JSON.parse(barEl.dataset.labels || "[]");
    const barData = JSON.parse(barEl.dataset.data || "[]");

    new Chart(barEl, {
      type: "bar", // <-- key change
      data: {
        labels: barLabels,
        datasets: [{
          label: "Daily Sales Revenue",
          data: barData,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Daily Sales Revenue (by Month)",
            font: { size: 16 }
          },
          legend: { display: false }
        },
        scales: {
          x: {
            title: { display: true, text: "Date" },
            ticks: { autoSkip: true, maxTicksLimit: 15 },
            grid: { display: false }
          },
          y: {
            title: { display: true, text: "Revenue ($)" },
            beginAtZero: true
          }
        }
      }
    });
  }
});
