const db = require("../mysql/index"); // path tumhare db.js ke hisab se
const User = db.User;

// 1️⃣ Create a new collect
const createAdtocart = async (req, res) => {
    try {
        const { userId, title, name, date, card_id } = req.body;
        if (!userId || !title || !name || !card_id) {
            return res.json({ success: false, message: "userId, title, and name are required" });
        }

        // check if user exists
        let user = await db.User.findOne({ where: { id: userId } })
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let add_to_cart = await db.Addcart.findOne({ where: { card_id } })
        if (add_to_cart) {
            return res.json({ success: false, message: "Item already available in the cart" });
        }

        const newCollect = await db.Addcart.create({
            user_id:userId,
            title,
            name,
            date: date || new Date(),
            card_id
        });

        return res.status(201).json({ success: true, data: newCollect });
    } catch (error) {
        console.error("Error creating collect:", error);
        return res.json({ success: false, message: "Server error" });
    }
};

const deleteAdtocart = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.json({ success: false, message: "Collect id is required" });
        }

         let addcart = await db.Addcart.findOne({ where: { id: id } })
        if (!addcart) {
            return res.json({ success: false, message: "Collect not found" });
        }

        await db.Addcart.destroy({ where: { id } });

        return res.status(200).json({ success: true, message: "Collect deleted successfully" });
    } catch (error) {
        console.error("Error deleting collect:", error);
        return res.json({ success: false, message: "Server error" });
    }
};

const getAdtocarts = async (req, res) => {
    try {
        const { userId } = req.query;
        const cartWhere = {};
        if (userId) cartWhere.user_id = userId;

        const carts = await db.Addcart.findAll({
            where: cartWhere,
            include: [
                {
                    model: db.AntiqueCoins,
                    as: "card", // 👈 same alias jo relation me diya tha
                    required: true, // inner join (optional)
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            data: carts,
        });
    } catch (error) {
        console.error("Error fetching add to carts:", error);
        return res.json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    createAdtocart,
    deleteAdtocart,
    getAdtocarts,
};
