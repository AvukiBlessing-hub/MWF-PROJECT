// routes/deliveryRoutes.js
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");
const moment = require("moment");
const DeliveryModel = require("../models/deliveryModel");
const SaleModel = require("../models/salesModel"); // import sales

// ================= Show Delivery Page =================
router.get("/delivery", ensureAuthenticated, async (req, res) => {
  try {
    // Fetch only sales that have not been delivered yet
    const sales = await SaleModel.find({}).sort({ paymentDate: -1 }).lean();

    res.render("delivery", {
      title: "Delivery Page",
       sales,   // 👈 match pug variable
      currentUser: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ================= Handle Delivery Submission =================
router.post("/delivery", ensureAuthenticated, async (req, res) => {
  try {
    const { saleId, deliveryStatus } = req.body;

    // Check that the sale exists
    const sale = await SaleModel.findById(saleId);
    if (!sale) {
      return res.status(400).send("Cannot create delivery: sale does not exist.");
    }

    // Compute total price (could also include transport)
    const transportFee = req.body.transport === "on" ? sale.costPrice * 0.05 : 0;
    const totalPrice = (sale.costPrice + transportFee) * sale.quantity;

    const delivery = new DeliveryModel({
      customerName: sale.customerName,
      customerAddress: req.body.customerAddress,
      productName: sale.productName,
      quantity: sale.quantity,
      paymentType: sale.paymentMethod,
      basePrice: sale.costPrice,
      transport: req.body.transport === "on",
      totalPrice,
      deliveryStatus,
    });

    await delivery.save();
    res.redirect("/deliverylist");
  } catch (error) {
    console.error(error);
    res.redirect("/delivery");
  }
});
router.get("/deliverylist", ensureAuthenticated, async (req, res) => {
  try {
    const deliveries = await DeliveryModel.find().sort({ createdAt: -1 }).lean();

    res.render("deliverytable", {
      title: "Delivery List",
      deliveries,     // all deliveries
      currentUser: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
