const express = require("express");
const router = express.Router();
const {ensureauthenticated, ensureAgent} = require("../middleware/auth")
const stockModels = require("../models/salesModel");
const { ensureAgent } = require("../middleware/auth");

// router.get("/stock")
router.get("/Addsale", (req, res) => {
  res.render("sales", { title: "sales Page" });
});
router.post("/sales", ensureauthenticated, ensureAgent, async (req, res) => {
  try{
    const{customername, producttype, quantity, unitprice,transpotcheck,paymentmethod, paymentdate} = req.body;
    const userId = req.session.user._id;


    const sale = new salesModels({
      customername,
       producttype,
        quantity,
         unitprice,
         transpotcheck,
         paymentmethod,
          salesAgent: userId,
          paymentdate
         
    })
    console.log(req.body)
    await sale.save()
    res.redirect("/saleslist")
  } catch (error) {
    console.error(error.message)
    res.redirect("/Addsale")

  } 
});
router.get("/saleslist", async (req, res) => {
  try {
    //  sales agent only sees their own sales
    const sales = await salesModelfind().populate("salseAgent","fullName")
    const currentUser = req.session.user
    console.log(currentUser)
     res.render("salestable",{sales, currentUser})

  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
 
})




module.exports = router;