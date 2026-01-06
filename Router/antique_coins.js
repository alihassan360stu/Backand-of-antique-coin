const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { createSellCoinRequest,getSellCoinRequests,deleteSellCoinRequest } = require("../controller/antique_coins");
const authMiddleware = require("../middlewares/authenticateToken"); // login user id ke liye

router.post("/create", upload.single("file"), createSellCoinRequest);
router.get("/", getSellCoinRequests);
router.delete("/delete/:id", deleteSellCoinRequest);


module.exports = router;
