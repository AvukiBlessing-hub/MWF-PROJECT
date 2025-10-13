const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/auth");
const salesModel = require("../models/salesModel");
const stockModel = require("../models/stockModel"); // Assuming you have a stock model
const moment = require("moment");

// ===== Helper function to fetch sales safely =====
async function getSalesForUser(user) {
  const role = user.role.toLowerCase();

  if (role === "manager") {
    return await salesModel.find().populate("Attendant", "fullname").lean();
  } else if (role === "attendant") {
    return await salesModel
      .find({ Attendant: new mongoose.Types.ObjectId(user._id) })
      .populate("Attendant", "fullname")
      .lean();
  } else {
    throw new Error("Access denied");
  }
}

// ===== Record Sale Form Page =====
router.get("/sales/add", isAuthenticated, async (req, res) => {
  try {
    const stocks = await stockModel.find().lean(); // pass stock data for dropdown
    res.render("sales", { stocks, currentUser: req.user });
  } catch (err) {
    console.error("Error loading sales form:", err.message);
    res.status(500).send("Error loading sales form");
  }
});

// ===== Create Sale (POST) =====
router.post("/sales", isAuthenticated, async (req, res) => {
  try {
    const data = {
      ...req.body,
      Attendant: req.user._id // attach current user
    };
    await salesModel.create(data);
    res.redirect("/saleslist"); // ✅ redirect to sales list after creating
  } catch (err) {
    console.error("Error creating sale:", err.message);
    res.status(500).send("Error creating sale");
  }
});

// ===== Sales Pages =====
router.get(["/saleslist", "/sales"], isAuthenticated, async (req, res) => {
  try {
    const sales = await getSalesForUser(req.user);
    res.render("salestable", { items: sales, currentUser: req.user, moment });
  } catch (error) {
    console.error("Error fetching sales:", error.message);
    res.status(403).send("Access denied");
  }
});

// ===== Edit Sale Page (GET) =====
router.get("/editsales/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid sale ID");

    const sale = await salesModel.findById(id).populate("Attendant", "fullname").lean();
    if (!sale) return res.status(404).send("Sale not found");

    if (req.user.role.toLowerCase() === "attendant" &&
        sale.Attendant._id.toString() !== req.user._id.toString()) {
      return res.status(403).send("Access denied");
    }

    res.render("editsales", { item: sale, currentUser: req.user });
  } catch (error) {
    console.error("Error loading edit page:", error.message);
    res.status(500).send("Error loading edit page");
  }
});

// ===== Edit Sale (POST) =====
router.post("/editsales/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid sale ID");

    const sale = await salesModel.findById(id);
    if (!sale) return res.status(404).send("Sale not found");

    if (req.user.role.toLowerCase() === "attendant" &&
        sale.Attendant.toString() !== req.user._id.toString()) {
      return res.status(403).send("Access denied");
    }

    await salesModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.redirect("/saleslist"); // redirect to sales list after editing
  } catch (err) {
    console.error("Error updating sale:", err.message);
    res.status(500).send("Error updating sale");
  }
});

// ===== Delete Sale (Manager only) =====
router.post("/deletesales/:id", isAuthenticated, async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== "manager") return res.status(403).send("Access denied");

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid sale ID");

    await salesModel.findByIdAndDelete(id);
    res.redirect("/saleslist"); // redirect to sales list after deletion
  } catch (err) {
    console.error("Error deleting sale:", err.message);
    res.status(500).send("Error deleting sale");
  }
});

module.exports = router;
