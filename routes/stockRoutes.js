const express = require("express");
const router = express.Router();
const { isAuthenticated, isManager } = require("../middleware/auth");
const moment = require("moment");
const stockModel = require("../models/stockModel");

// ================= Stock page =================
router.get("/stock", isAuthenticated, isManager, (req, res) => {
  res.render("stock", { title: "Stock Page" });
});

// ================= Add Stock =================
router.post("/stock", isAuthenticated, isManager, async (req, res) => {
  try {
    console.log("POST /stock hit");
    console.log("Form data:", req.body);

    const {
      productName,
      productType,
      totalQuantity,
      availableQuantity,
      quality,
      costPrice,
      sellingPrice,
      supplierName,
      supplierContact,
      date
    } = req.body;

    if (!productName || !totalQuantity || !costPrice) {
      console.log("Missing required fields!");
      return res.status(400).send("Product Name, Total Quantity, and Cost Price are required");
    }

    const stockData = {
      productName,
      productType,
      totalQuantity: Number(totalQuantity) || 0,
      availableQuantity: Number(availableQuantity) || Number(totalQuantity) || 0,
      quality,
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      supplierName,
      supplierContact,
      date: date ? new Date(date) : new Date()
    };

    console.log("Saving stock:", stockData);

    const stock = new stockModel(stockData);
    await stock.save();

    console.log("Stock saved successfully!");
    res.redirect("/stocklist");
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).send("Error adding stock");
  }
});

// ================= Stock List =================
router.get("/stocklist", isAuthenticated, async (req, res) => {
  try {
    const items = await stockModel.find().sort({ date: -1 }).lean(); // sort by actual stock date
    console.log("Fetched items from DB:", items.length);
    res.render("stocklist", { items, moment });
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).send("Unable to get stock data");
  }
});

// ================= Edit Stock =================
router.get("/editstock/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    const item = await stockModel.findById(req.params.id).lean();
    if (!item) return res.status(404).send("Product not found");
    res.render("editstock", { item });
  } catch (error) {
    console.error("Error loading edit form:", error);
    res.status(500).send("Error loading edit form");
  }
});

router.post("/editstock/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    const {
      productName,
      productType,
      totalQuantity,
      availableQuantity,
      quality,
      costPrice,
      sellingPrice,
      supplierName,
      supplierContact,
      date
    } = req.body;

    const updatedData = {
      productName,
      productType,
      totalQuantity: Number(totalQuantity) || 0,
      availableQuantity: Number(availableQuantity) || Number(totalQuantity) || 0,
      quality,
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      supplierName,
      supplierContact,
      date: date ? new Date(date) : new Date()
    };

    await stockModel.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });

    res.redirect("/stocklist");
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).send("Error updating stock");
  }
});

// ================= Delete Stock =================
router.post("/deletestock/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    await stockModel.findByIdAndDelete(req.params.id);
    res.redirect("/stocklist");
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).send("Unable to delete stock");
  }
});

// ================= Debug Route =================
router.get("/stock/test", async (req, res) => {
  try {
    const allStock = await stockModel.find().lean();
    console.log("All stock in DB:", allStock.length);
    res.json(allStock);
  } catch (err) {
    res.status(500).send("Error fetching stock for test");
  }
});

// ================= API Routes =================

// API Route: Get all stock items (for sales page)
router.get('/api/stocklist', async function(req, res) {
  try {
    console.log('API: Fetching stock list...');
    
    const stockItems = await stockModel.find({})
      .select('productName productType totalQuantity availableQuantity costPrice sellingPrice quality supplierName date')
      .lean();
    
    console.log('API: Found ' + stockItems.length + ' stock items');
    res.json(stockItems);
    
  } catch (error) {
    console.error('API Error - Stock List:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stock list',
      message: error.message 
    });
  }
});

//  API Route: Aggregated Stock Overview (for Sales Form)
router.get('/api/stockoverview', async function(req, res) {
  try {
    console.log('API: Generating stock overview...');
    
    // Use MongoDB aggregation for server-side grouping by productName + productType
    const stockAggregation = await stockModel.aggregate([
      {
        $group: {
          _id: { productName: "$productName", productType: "$productType" },
          totalAvailable: { $sum: "$availableQuantity" },
          totalQuantity: { $sum: "$totalQuantity" },
          averageCostPrice: { $avg: "$costPrice" },
          averageSellingPrice: { $avg: "$sellingPrice" }
        }
      },
      { $match: { totalAvailable: { $gt: 0 } } },
      { $sort: { "_id.productName": 1, "_id.productType": 1 } }
    ]);
    
    console.log('API: Generated ' + stockAggregation.length + ' overview items');
    
    res.json(stockAggregation);
    
  } catch (error) {
    console.error('API Error - Stock Overview:', error);
    res.status(500).json({ 
      error: 'Failed to generate stock overview',
      message: error.message 
    });
  }
});

module.exports = router;
