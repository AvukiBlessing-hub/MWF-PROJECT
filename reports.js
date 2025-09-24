async function loadReport(type) {
    const reportTitle = document.getElementById('report-title');
    const reportTable = document.getElementById('report-table');
    const reportHeaders = document.getElementById('report-headers');
    const reportBody = document.getElementById('report-body');

    reportTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1) + " Report";

    // Clear old data
    reportHeaders.innerHTML = "";
    reportBody.innerHTML = "";

    try {
        // Fetch data from your Node.js backend (example: /api/sales, /api/stock, /api/delivery)
        const res = await fetch(`/api/${type}`);
        const data = await res.json();

        if (data.length === 0) {
            reportBody.innerHTML = "<tr><td colspan='5'>No data available</td></tr>";
            reportTable.classList.remove("hidden");
            return;
        }

        // Generate headers dynamically
        const keys = Object.keys(data[0]);
        keys.forEach(key => {
            const th = document.createElement("th");
            th.textContent = key.toUpperCase();
            reportHeaders.appendChild(th);
        });

        // Fill table body
        data.forEach(row => {
            const tr = document.createElement("tr");
            keys.forEach(key => {
                const td = document.createElement("td");
                td.textContent = row[key];
                tr.appendChild(td);
            });
            reportBody.appendChild(tr);
        });

        reportTable.classList.remove("hidden");
    } catch (err) {
        console.error("Error fetching report:", err);
        reportBody.innerHTML = "<tr><td colspan='5'>Error loading data</td></tr>";
        reportTable.classList.remove("hidden");
    }
}
