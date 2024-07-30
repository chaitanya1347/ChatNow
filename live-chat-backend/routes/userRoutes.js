const express = require("express");
const router = express.Router();
const {loginController,registerController,findUsers,fetchUsers} = require("../Controllers/userController");
const authMiddleware  = require("../middlewares/authMiddleware");

router.post("/login",loginController);
router.post("/register",registerController);
router.route("/register").get(findUsers);
module.exports = router;