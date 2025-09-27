const express = require("express");
const router = express.Router();
const { ensureauthenticated, ensureAgent } = require("../middleware/auth");
const salesModel = require("../models/SalesModel");
const stockModel = require("../models/stockModel");

// GET /addsale - Show sales form
router.get("/addsale", ensureauthenticated, ensureAgent, async (req, res) => {
  try {
    const stock = await stockModel.find(); // optional: for dropdown
    res.render("sales", { title: "Sales Page", stock });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});

// POST /addsale - Save sale
router.post("/addsale", ensureauthenticated, ensureAgent, async (req, res) => {
  try {
    const {
      customerName,
      productType,
      productName,
      quantity,
      quality,
      costPrice,
      transport,
      paymentMethod,
      paymentDate
    } = req.body;

    const userId = req.session.user._id;

    const stock = await stockModel.findOne({ productType, productName });
    if (!stock) return res.status(400).send("Stock not found");

    if (stock.quantity < Number(quantity)) {
      return res.status(400).send(`Insufficient stock, only ${stock.quantity} available`);
    }

    const transportFee = transport === "on" || transport === "true";
    let total = Number(costPrice) * Number(quantity);
    if (transportFee) total *= 1.05;

    const sale = new salesModel({
      customerName,
      productType,
      productName,
      quantity: Number(quantity),
      quality,
      costPrice: Number(costPrice),
      transportFee,
      totalPrice: total,
      salesAgent: userId,
      paymentMethod,
      paymentDate: paymentDate || Date.now()
    });

    await sale.save();

    stock.quantity -= Number(quantity);
    await stock.save();

    res.redirect("/saleslist");
  } catch (error) {
    console.error(error.message);
    res.redirect("/addsale");
  }
});

//  ADD THIS ROUTE HERE
router.get("/saleslist", ensureauthenticated, ensureAgent, async (req, res) => {
  try {
    const currentUser = req.session.user;
    const sales = await salesModel.find().populate("salesAgent", "fullName");
    res.render("salestable", { sales, currentUser });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});

module.exports = router;
