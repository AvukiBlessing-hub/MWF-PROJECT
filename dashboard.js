// ======== Simple client-side "auth" (demo only) ========
const GATE_KEY = "wf_manager_auth";

// No need for MANAGER_CODE anymore

const gateEl = document.getElementById("gate");
const appEl = document.getElementById("app");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const gateMsg = document.getElementById("gateMsg");

// Always allow login
loginBtn.addEventListener("click", () => {
  localStorage.setItem(GATE_KEY, "true"); // store a flag
  gateEl.style.display = "none";
  appEl.style.display = "block";
  gateMsg.textContent = "Login successful!";
});

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(GATE_KEY);
  appEl.style.display = "none";
  gateEl.style.display = "block";
  gateMsg.textContent = "Logged out.";
});

// Auto-login check
if (localStorage.getItem(GATE_KEY)) {
  gateEl.style.display = "none";
  appEl.style.display = "block";
}


function showApp() {
  gateEl.classList.add("hidden");
  appEl.classList.remove("hidden");
  initDashboard();
}
function showGate() {
  appEl.classList.add("hidden");
  gateEl.classList.remove("hidden");
}
function attemptAutoLogin() {
  if (localStorage.getItem(GATE_KEY) === "ok") showApp();
}
loginBtn.addEventListener("click", () => {
  const code = document.getElementById("managerCode").value.trim();
  if (code === MANAGER_CODE) {
    localStorage.setItem(GATE_KEY, "ok");
    showApp();
  } else {
    gateMsg.textContent = "Invalid manager code.";
  }
});
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(GATE_KEY);
  location.reload();
});
attemptAutoLogin();

// ======== Demo data generators ========
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PRODUCTS = ["Chairs", "Beds", "Sofas", "Cupboards", "Timber", "Dining Tables", "Other"];

function seededRand(seed) {
  // Simple xorshift-ish
  let t = (seed += 0x6D2B79F5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function generateMonthlyDemand(seedBase = 42) {
  // Varies per product & month: some months high, some low
  // Use seasonal bumps: e.g., Mar/Apr moderate, Jul–Sep high, Dec high (holiday)
  const seasonBoost = (mIdx) => {
    if ([6, 7, 8].includes(mIdx)) return 1.3;  // Jul–Sep
    if (mIdx === 11) return 1.25;            // Dec
    if ([2, 3].includes(mIdx)) return 1.1;    // Mar–Apr
    return 1.0;
  };

  const mapped = {};
  PRODUCTS.forEach((prod, pIdx) => {
    const base = 60 + pIdx * 10; // different baseline per product
    mapped[prod] = MONTHS.map((_, mIdx) => {
      const r = seededRand(seedBase + pIdx * 97 + mIdx * 131);
      const noise = (r - 0.5) * 30; // ±15 variability
      const val = Math.max(10, Math.round((base + noise) * seasonBoost(mIdx)));
      return val;
    });
  });
  return mapped;
}

function generateInventory(seed = 7) {
  return PRODUCTS.map((prod, i) => {
    const stock = Math.round(30 + seededRand(seed + i) * 170); // 30–200
    return { product: prod, stock };
  });
}

function generateOrders(seed = 11) {
  const sample = [
    "Chairs", "Beds", "Sofas", "Cupboards", "Timber", "Dining Tables", "Other"
  ];
  const rows = [];
  for (let i = 0; i < 7; i++) {
    const product = sample[Math.floor(seededRand(seed + i) * sample.length)];
    const qty = Math.ceil(seededRand(seed * 3 + i) * 12) + 1;
    const status = seededRand(seed * 9 + i) > 0.5 ? "Processing" : "Awaiting Payment";
    rows.push({ id: 1001 + i, product, qty, status });
  }
  return rows;
}

function generateFeedback(seed = 21) {
  const customers = ["A. Okello", "B. Namusoke", "C. Kato", "D. Mbabazi", "E. Nambi", "F. Kagwa", "G. Lumu"];
  const notes = [
    "Solid build quality.",
    "Delivery was quick.",
    "Finish could be smoother.",
    "Great value for money!",
    "Exactly as described.",
    "Packaging was excellent.",
    "Will order again."
  ];
  const list = [];
  for (let i = 0; i < 6; i++) {
    const rating = 3 + Math.round(seededRand(seed + i) * 2); // 3–5
    list.push({
      customer: customers[i],
      product: PRODUCTS[i % PRODUCTS.length],
      rating,
      comment: notes[i]
    });
  }
  return list;
}

// ======== KPI, Alerts & Tables ========
const kpiStockEl = document.getElementById("kpiStock");
const kpiNewOrdersEl = document.getElementById("kpiNewOrders");
const kpiPendingEl = document.getElementById("kpiPending");
const kpiFeedbackEl = document.getElementById("kpiFeedback");
const kpiAlertsEl = document.getElementById("kpiAlerts");
const kpiTopProductEl = document.getElementById("kpiTopProduct");
const alertListEl = document.getElementById("alertList");
const ordersTableEl = document.getElementById("ordersTable");
const feedbackTableEl = document.getElementById("feedbackTable");

function pickTopProduct(demandMap) {
  // Sum across months; return highest
  let best = { name: "", total: -1 };
  for (const prod of PRODUCTS) {
    const sum = demandMap[prod].reduce((a, b) => a + b, 0);
    if (sum > best.total) best = { name: prod, total: sum };
  }
  return best.name;
}

function populateKpis(inv, orders, feedback, demandMap) {
  const totalStock = inv.reduce((a, b) => a + b.stock, 0);
  const newOrders = orders.length;
  const pendingDeliveries = Math.round(newOrders * 0.6); // demo figure
  const goodFeedback = feedback.filter(f => f.rating >= 4).length;
  const lowItems = inv.filter(i => i.stock < 50).length;
  const top = pickTopProduct(demandMap);

  kpiStockEl.textContent = totalStock;
  kpiNewOrdersEl.textContent = newOrders;
  kpiPendingEl.textContent = pendingDeliveries;
  kpiFeedbackEl.textContent = `${goodFeedback} / ${feedback.length}`;
  kpiAlertsEl.textContent = lowItems;
  kpiTopProductEl.textContent = top;
}

function populateAlerts(inv) {
  alertListEl.innerHTML = "";
  if (inv.length === 0) return;
  const sorted = inv.slice().sort((a, b) => a.stock - b.stock);
  sorted.forEach(item => {
    const li = document.createElement("li");
    const level = item.stock < 30 ? "danger" : item.stock < 50 ? "warn" : "ok";
    li.innerHTML = `
      <span>${item.product}</span>
      <span class="badge ${level}">${item.stock} in stock</span>
    `;
    if (level !== "ok") alertListEl.appendChild(li);
  });
  if (!alertListEl.children.length) {
    const li = document.createElement("li");
    li.innerHTML = `<span>All good</span><span class="badge ok">No low stock</span>`;
    alertListEl.appendChild(li);
  }
}

function populateOrdersTable(rows) {
  ordersTableEl.innerHTML = rows.map(r => `
    <tr>
      <td>#${r.id}</td>
      <td>${r.product}</td>
      <td>${r.qty}</td>
      <td>${r.status}</td>
    </tr>
  `).join("");
}

function populateFeedbackTable(rows) {
  feedbackTableEl.innerHTML = rows.map(r => `
    <tr>
      <td>${r.customer}</td>
      <td>${r.product}</td>
      <td>${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</td>
      <td>${r.comment}</td>
    </tr>
  `).join("");
}

// ======== Chart ========
let chartRef = null;

function colorsForMonths() {
  const now = new Date();
  const currentIdx = now.getMonth(); // 0=Jan
  const base = Array(12).fill("rgba(99,102,241,0.6)"); // base color
  // Highlight from current month onward
  for (let i = currentIdx; i < 12; i++) {
    base[i] = "rgba(34,197,94,0.8)"; // highlight color
  }
  return base;
}

function buildDatasetFor(prodName, values, baseHueShift = 0) {
  // One dataset per product as a line; month bars color is handled via bar background
  return {
    label: prodName,
    data: values,
    type: "line",
    fill: false,
    borderWidth: 2,
    tension: 0.25
  };
}

function renderChart(demandMap) {
  const ctx = document.getElementById("demandChart").getContext("2d");
  if (chartRef) chartRef.destroy();

  const monthColors = colorsForMonths();

  // Use a combo: stacked bars for total + lines per product (clear view)
  const totals = MONTHS.map((_, i) => {
    return PRODUCTS.reduce((sum, prod) => sum + demandMap[prod][i], 0);
  });

  const datasets = [
    {
      type: "bar",
      label: "Total Demand",
      data: totals,
      backgroundColor: monthColors,
      borderWidth: 0,
    },
    ...PRODUCTS.map((prod, idx) => buildDatasetFor(prod, demandMap[prod], idx * 40))
  ];

  chartRef = new Chart(ctx, {
    data: {
      labels: MONTHS,
      datasets
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "bottom" },
        tooltip: { enabled: true },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 50 }
        }
      }
    }
  });
}

// ======== Initialization ========
const refreshBtn = document.getElementById("refreshBtn");

function initDashboard() {
  // Create demo data (change seed to vary)
  const demand = generateMonthlyDemand(Math.floor(Date.now() / 86400000)); // seed by day
  const inventory = generateInventory();
  const orders = generateOrders();
  const feedback = generateFeedback();

  populateKpis(inventory, orders, feedback, demand);
  populateAlerts(inventory);
  populateOrdersTable(orders);
  populateFeedbackTable(feedback);
  renderChart(demand);
}

refreshBtn.addEventListener("click", initDashboard);
