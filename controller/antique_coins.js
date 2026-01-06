const db = require("../mysql/index");
const validator = require("validator");
const fs = require("fs");
const path = require("path");


const createSellCoinRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      cnic,
      coin_title,
      quantity,
      expected_rates,
      country,
      address,
      why_selling,
      user_id
    } = req.body;

    // ===== Validation =====
    let errors = [];

    if (!name) errors.push("Name is required");
    if (!email || !validator.isEmail(email)) errors.push("Valid email is required");
    if (!contact || !validator.isMobilePhone(contact, "any")) errors.push("Valid contact is required");
    if (!cnic || !/^\d{5}-\d{7}-\d{1}$/.test(cnic)) errors.push("CNIC must be in 12345-1234567-1 format");
    if (!coin_title) errors.push("Coin title is required");
    if (!quantity || isNaN(quantity)) errors.push("Quantity must be a number");
    if (!expected_rates || isNaN(expected_rates)) errors.push("Expected rates must be a number");
    if (!country) errors.push("Country is required");
    if (!address) errors.push("Address is required");
    if (!why_selling) errors.push("Selling reason is required");
    if (!user_id) errors.push("User id is required");


    if (errors.length > 0) return res.json({ success: false, message: errors });

    let file_name = null,
      file_path = null;

    if (req.file) {
      file_name = req.file.originalname;
      file_path = req.file.path;
    }

    const sellRequest = await db.AntiqueCoins.create({
      user_id: user_id,
      name,
      email,
      contact,
      cnic,
      coin_title,
      quantity,
      expected_rates,
      why_selling,
      country,
      address,
      file_name,
      file_path,
    });

    return res.status(201).json({
      success: true,
      message: "Sell coin request created successfully",
      data: sellRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getSellCoinRequests = async (req, res) => {
  try {
    const { search } = req.query;
   

    const whereClause = {};
    // if (user_id) whereClause.user_id = user_id;
    if (search) whereClause.coin_title = search;

    const sellRequests = await db?.AntiqueCoins?.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]], 
    });

    return res.status(200).json({
      success: true,
      data: sellRequests,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching sell coin requests",
    });
  }
};


const deleteSellCoinRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json({ success: false, message: "Sell coin ID is required" });
    }

    const sellRequest = await db.AntiqueCoins.findOne({
      where: { id }
    });

    if (!sellRequest) {
      return res.json({
        success: false,
        message: "Sell coin request not found"
      });
    }

    if (sellRequest.file_path) {
      const fullPath = path.join(__dirname, "..", sellRequest.file_path);


      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await db.AntiqueCoins.destroy({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: "Sell coin request deleted successfully"
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Server error while deleting sell coin request"
    });
  }
};

module.exports = {
  createSellCoinRequest,
  getSellCoinRequests,
  deleteSellCoinRequest
};
