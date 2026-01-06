const routes = require("express").Router()
const {sign_up,sign_in,users,uploadProfile} = require("../controller/user.js")
const auth = require("../middlewares/authenticateToken.js")
const upload = require("../middlewares/uploadPrifleImage.js");
// const upload = require("../middlewares/uploadPrifleImage.js")


routes.post("/register",sign_up);
routes.post("/login",sign_in);
routes.get("/users",auth,users);
routes.post("/upload-profile",upload.single("file"),uploadProfile);

module.exports = routes;