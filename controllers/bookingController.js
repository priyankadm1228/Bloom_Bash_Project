const Booking = require("../models/booking");

exports.getBookingForm = (req, res) => {
  res.render("newBooking");
};

exports.bookEvent = async (req, res) => {
  try {
    console.log("Session Data:", req.session); // ✅ Debugging step
    if (!req.session.user) {
      return res
        .status(401)
        .send("❌ User not logged in. Please sign in first.");
    }

    const { firstName, lastName, phone, events, service, date, location } =
      req.body;
    const userId = req.session.user._id;

    const Newbooking = new Booking({
      firstName,
      lastName,
      phone,
      events,
      service,
      date: new Date(date),
      location,

      user: userId,
    });
    await Newbooking.save();
    console.log("new booking is successful");
    const bookingDetails = await Booking.findById(Newbooking._id).populate(
      "user"
    );
    res.render("thankyou", { booking: bookingDetails });
  } catch (err) {
    console.error("❌ Error in booking:", err);
    res.status(500).send("Error processing booking.");
  }
};

exports.getBackToUserPage = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/users/signin"); // Redirect to sign-in if session is missing
    }

    const userId = req.session.user._id;

    // Fetch user bookings
    const userBookings = await Booking.find({ user: userId }).populate("user");

    res.render("userPortal", {
      user: req.session.user,
      bookings: userBookings,
    });
  } catch (err) {
    console.error("❌ Error loading user portal:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.displayBookingInfo = async (req, res) => {
  const bookingInformation = await Booking.find();
  res.render("bookingInfo", { bookingInformation });
};

exports.adminPortal = (req, res) => {
  res.render("adminPortal");
};

exports.updateBooking = async (req, res) => {
  try {
    // Extract updated fields from the request body
    let { firstName, lastName, phone, events, service, date, location } = req.body;

    // ✅ Convert `date` to a valid Date object
    if (date) {
      date = new Date(date); // Convert string to Date object
    }

    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, events, service, date, location },
      { new: true, runValidators: true }
    );
    
    if (!updatedBooking) {
      console.error("❌ Booking Not Found!");
      return res.status(404).send("Booking not found.");
    }
    
    console.log("✅ Booking Updated Successfully:", updatedBooking);
    res.redirect("userPortal");
    
  } catch (err) {
    console.error("❌ Error Updating booking:", err);
    res.status(500).send("Error updating booking.");
  }
};


exports.editBookingForm = async (req, res) => {
  try {
    const bookingDetails = await Booking.findById(req.params.id);
    if (!bookingDetails) {
      return res.status(404).send("User not found.");
    }
    res.render("editBooking", { bookingDetails });
  } catch (err) {
    console.error("Error Fetching booking details for Edit:", err);
    res.status(500).send("Error retrieving booking details.");
  }
};
exports.deleteBooking = async (req, res) => {
  try {
    const deletebooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletebooking) {
      return res.status(400).send("booking doest exists");
    }
    console.log(`booking Deleted: ${req.params.id}`);
    res.redirect("userPortal");
  } catch (err) {
    console.error("Error Deleting User:", err);
    res.status(500).send("Error deleting user.");
  }
};