const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// Create booking
router.post("/:listingId", isLoggedIn, async (req, res) => {
  try {
    const { listingId } = req.params;
    const { checkIn, checkOut } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).send("Listing not found");

    // Calculate days
    const days =
      (new Date(checkOut) - new Date(checkIn)) /
      (1000 * 60 * 60 * 24);

    if (days <= 0) return res.send("Invalid date selection");

    const totalPrice = listing.price * days;

    const booking = new Booking({
      listing: listingId,
      user: req.user._id,
      checkIn,
      checkOut,
      totalPrice,
    });

    await booking.save();

    res.redirect("/bookings/my");  // FIXED
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).send("Error creating booking");
  }
});

// View user bookings
router.get("/my", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing");
    const safeBookings = bookings.filter(b => b.listing);
    
  res.render("bookings/my", { bookings: safeBookings});
});

module.exports = router;
