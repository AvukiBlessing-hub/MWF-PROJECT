const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const DeliveryModel = require("../models/deliveryModel");
const SaleModel = require("../models/salesModel");

// ===== DELIVERY PAGE (based on sales) =====
router.get("/delivery", isAuthenticated, async (req, res) => {
  const sales = await SaleModel.find().lean();
  res.render("delivery", { title: "Add Delivery", sales, currentUser: req.user });
});

// ===== ADD DELIVERY (POST) =====
router.post("/delivery", isAuthenticated, async (req, res) => {
  const { saleId, deliveryStatus, transport } = req.body;

  const sale = await SaleModel.findById(saleId);
  if (!sale) return res.status(400).send("Sale not found");

  const totalPrice = sale.totalPrice + (transport ? sale.totalPrice * 0.05 : 0);

  const delivery = new DeliveryModel({
    customerName: sale.customerName,
    productName: sale.productName,
    quantity: sale.quantity,
    paymentType: sale.paymentMethod,
    basePrice: sale.costPrice,
    transport: transport ? true : false,
    totalPrice,
    deliveryStatus
  });

  await delivery.save();
  res.redirect("/deliverylist");
});

// ===== DELIVERY LIST =====
router.get("/deliverylist", isAuthenticated, async (req, res) => {
  const deliveries = await DeliveryModel.find().sort({ createdAt: -1 }).lean();
  res.render("deliverylist", { title: "Delivery List", deliveries, currentUser: req.user });
});

// ===== EDIT DELIVERY =====
router.get("/delivery/:id/edit", isAuthenticated, async (req, res) => {
  const delivery = await DeliveryModel.findById(req.params.id).lean();
  if (!delivery) return res.status(404).send("Delivery not found");
  res.render("editdelivery", { title: "Edit Delivery", product: delivery, currentUser: req.user });
});

router.post("/delivery/:id", isAuthenticated, async (req, res) => {
  const { customerName, productName, quantity, paymentType, basePrice, transport, deliveryStatus } = req.body;
  const totalPrice = Number(basePrice) * Number(quantity) + (transport ? Number(basePrice) * Number(quantity) * 0.05 : 0);

  await DeliveryModel.findByIdAndUpdate(req.params.id, {
    customerName,
    productName,
    quantity,
    paymentType,
    basePrice,
    transport: transport ? true : false,
    totalPrice,
    deliveryStatus
  });

  res.redirect("/deliverylist");
});

// ===== DELETE DELIVERY =====
router.post("/delivery/:id/delete", isAuthenticated, async (req, res) => {
  await DeliveryModel.findByIdAndDelete(req.params.id);
  res.redirect("/deliverylist");
});

module.exports = router;
