const express = require("express");
const router = express.Router();

const authMiddleware  = require("../middlewares/authMiddleware");
const {accessChat,fetchChat,createGroupChat,renameGroup,removeFromGroup,addToGroup,deleteChat,fetchGroupChats,findGroupChat} = require("../Controllers/chatControllers");

router.route("/").post(authMiddleware, accessChat);
router.route("/").get(authMiddleware, fetchChat);
router.route("/group").get(fetchGroupChats);
router.route("/findchat").post(authMiddleware,findGroupChat);
router.route("/group").post(authMiddleware, createGroupChat)
router.route("/rename").put(authMiddleware, renameGroup);
router.route("/groupremove").put(authMiddleware, removeFromGroup);
router.route("/groupadd").put(authMiddleware, addToGroup);
router.route("/deleteChat/:chatId").delete(deleteChat);
module.exports = router;     