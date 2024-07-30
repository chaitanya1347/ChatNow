const express = require("express");

const {allMessages,sendMessage} = require("../Controllers/messageControllers");
const protect  = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/:chatId/:name").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;