const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const DeliveryModel = require("../models/deliveryModel");
const SaleModel = require("../models/salesModel");
const moment = require("moment");

// Delivery page
router.get("/delivery", isAuthenticated, async (req, res) => {
  const sales = await SaleModel.find().lean();
  res.render("delivery", { title: "Delivery Page", sales, currentUser: req.user });
});

// Submit delivery
router.post("/delivery", isAuthenticated, async (req, res) => {
  const { saleId, deliveryStatus } = req.body;
  const sale = await SaleModel.findById(saleId);
  if (!sale) return res.status(400).send("Sale not found");

  const delivery = new DeliveryModel({
    customerName: sale.customerName,
    productName: sale.productName,
    quantity: sale.quantity,
    paymentType: sale.paymentMethod,
    basePrice: sale.costPrice,
    totalPrice: sale.totalPrice,
    deliveryStatus
  });
  await delivery.save();
  res.redirect("/deliverylist");
});

// Delivery list
router.get("/deliverylist", isAuthenticated, async (req, res) => {
  const deliveries = await DeliveryModel.find().sort({ createdAt: -1 }).lean();
  res.render("deliverytable", { title: "Delivery List", deliveries, currentUser: req.user });
});

module.exports = router;
