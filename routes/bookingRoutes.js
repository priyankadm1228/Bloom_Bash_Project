const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.get("/newBooking", bookingController.getBookingForm);
router.post("/newBooking", bookingController.bookEvent);
router.get("/userPortal", bookingController.getBackToUserPage);
router.get("/bookingInfo", bookingController.displayBookingInfo);
router.get("/adminPortal", bookingController.adminPortal);
router.get("/:id/editBooking", bookingController.editBookingForm);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
