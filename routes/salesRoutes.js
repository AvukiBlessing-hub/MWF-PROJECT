const express = require("express");
const router = express.Router();
const { ensureauthenticated, ensureAgent } = require("../middleware/auth")
const stockModels = require("../models/salesModel");
const { ensureAgent } = require("../middleware/auth");

// router.get("/stock")
router.get("/Addsale", async (req, res) => {
  try {
    const stock = await stockModels.find()
    res.render("sales", { title: "sales Page" });
  } catch (error) {
    console.error(error.meassge)
  }

});

router.post("/sales", ensureauthenticated, ensureAgent, async (req, res) => {
  try {
    const { customername, producttype, quantity, unitprice, transpotcheck, paymentmethod, paymentdate, totalprice } = req.body;
    const userId = req.session.user._id;
    const stock = await stockModels.findOne({ producttype: producttype, productName: product });
    if (!stock) {
      return res.status(400).send("stock not found")
    };
    if (stock.quantity < Number(quantity)) {
      return res.status(400).send(`insufficent stock, only${stock.quantity} available`)
    };

    // if u do not have toatal price price captured in the frontend
    let total = unitprice * quantity
    if (transportcheck) {
      total *= 1.05
    };

    //  if u have total price already captured 
    // if(transportcheck){
    //  grandprice = totalprice*= 1.05      //add 5%
    // };
    if (stock && stock.quantity > 0) {
      const sale = new salesModels({
        customername,
        producttype,
        quantity,
        unitprice,
        transpotcheck: !!transportcheck,
        paymentmethod,
        totalprice: total,
        salesAgent: userId,
        paymentdate
      })
      console.log("saving sale:", sale);
      console.log(req.body)
      await sale.save()

      // decrease quantity from the stock collection
      stock.quantity -= quantity
      console.log("new quantity after sale", stock.quantity)
      await stock.save();
      res.redirect("/saleslist")
    } else {
      return res.status(404).send("product not found or solid out.")
    }
  } catch (error) {
    console.error(error.message)
    res.redirect("/Addsale")

  }
});
router.get("/saleslist", async (req, res) => {
  try {
    //  sales agent only sees their own sales
    const sales = await salesModelfind().populate("salseAgent", "fullName")
    const currentUser = req.session.user
    console.log(currentUser)
    res.render("salestable", { sales, currentUser })

  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }

})




module.exports = router;