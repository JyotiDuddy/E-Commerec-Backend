const express= require("express");

const router = express.Router();

const {getAllNotification,getUnreadCount,markSingleRead,markAllRead}= require("../controllers/notification.controller");



// admin

router.get("/admin/unread-count",getUnreadCount);

router.get("/admin/all",getAllNotification);

router.put("/admin/mark-read/:id",markAllRead);

router.put("/admin/mark-all-read",markAllRead);


module.exports= router