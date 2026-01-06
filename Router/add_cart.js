const express = require("express");
const router = express.Router();
const { createAdtocart,deleteAdtocart,getAdtocarts } = require("../controller/add_cart");
const authMiddleware = require("../middlewares/authenticateToken");

router.post("/add",  createAdtocart);
router.get("/", getAdtocarts);
router.delete("/delete/:id", deleteAdtocart);


module.exports = router;
