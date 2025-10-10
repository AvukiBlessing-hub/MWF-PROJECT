const express = require("express");
const router = express.Router();
const moment = require("moment");
const { isAuthenticated, isManager } = require("../middleware/auth");
const stockModel = require("../models/stockModel");
const salesModel = require("../models/salesModel");
const deliveryModel = require("../models/deliveryModel");

// ================= Dashboard =================
router.get("/dashboard", isAuthenticated, isManager, async (req, res) => {
  try {
    // ===== Total Sales =====
    const totalSales = await salesModel.countDocuments();

    // ===== Total Revenue =====
    const revenueAgg = await salesModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // ===== Stock Summary =====
    const stockSummary = await stockModel.aggregate([
      { $group: { _id: "$productName", totalAvailable: { $sum: "$availableQuantity" } } },
      { $project: { productName: "$_id", totalAvailable: 1, _id: 0 } }
    ]);

    const stockAlerts = stockSummary.map(item => {
      let alertMessage;
      if (item.totalAvailable < 5) alertMessage = `Restock urgently (${item.totalAvailable} left)`;
      else if (item.totalAvailable < 10) alertMessage = `Restock soon (${item.totalAvailable} left)`;
      else if (item.totalAvailable >= 20) alertMessage = `Plenty (${item.totalAvailable} left)`;
      else alertMessage = `Low stock (${item.totalAvailable} left)`;

      return { productName: item.productName, totalAvailable: item.totalAvailable, alertMessage };
    });

    const stockAvailable = stockSummary.reduce((sum, item) => sum + item.totalAvailable, 0);

    // ===== Pending Deliveries =====
    const pendingDeliveries = await deliveryModel.countDocuments({ deliveryStatus: { $ne: "Delivered" } });

    // ===== Most Sold Products (Pie Chart) =====
    const mostBought = await salesModel.aggregate([
      { $group: { _id: "$productName", totalQuantity: { $sum: "$quantity" } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);
    const pieLabels = mostBought.map(item => item._id);
    const pieData = mostBought.map(item => item.totalQuantity);

    // ===== Daily Sales for Current Month (Bar Chart) =====
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const dailySales = await salesModel.aggregate([
      { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } }, // uses your existing `date` field
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalRevenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const salesTrendLabels = dailySales.map(s => s._id);
    const salesTrendData = dailySales.map(s => s.totalRevenue);

    // ===== Render Dashboard =====
    res.render("dashboard", {
      title: "Manager Dashboard",
      totalSales,
      totalRevenue,
      stockAvailable,
      stockAlerts,
      pendingDeliveries,
      pieLabels: JSON.stringify(pieLabels),
      pieData: JSON.stringify(pieData),
      salesTrendLabels: JSON.stringify(salesTrendLabels),
      salesTrendData: JSON.stringify(salesTrendData)
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Unable to load dashboard");
  }
});

module.exports = router;
