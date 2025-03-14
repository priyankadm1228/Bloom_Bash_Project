const User = require("../models/User");
const bcrypt = require("bcrypt");
const { find } = require("../models/User");
const Booking = require("../models/booking");
exports.showSignUpForm = (req, res) => {
  res.render("signup", {
    errorMessage: null,
    username: "",
    email: "",
    role: "",
  });
};

exports.signUpUser = async (req, res) => {
  try {
    const { username, email, role, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.render("signup", {
        errorMessage:
          existingUser.email === email && existingUser.username === username
            ? "❌ Username and Email already exist"
            : existingUser.email === email
            ? "❌ Email already exists"
            : "❌ Username already exists",
        username,
        email,
        role,
      });
    }
    if (password !== confirmPassword) {
      return res.render("signup", {
        errorMessage: "Password doesn't Match",
        username,
        email,
        role,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      role,
      password: hashedPassword,
    });
    await newUser.save();
    console.log("new user is sucessfully resgistered");

    res.render("success", { username });
  } catch (err) {
    console.error("Error signing up :", err);
    res.render("signup", {
      errorMessage: "Internal sever error. Please try again",
      username,
      email,
      role,
    });
  }
};

exports.showSignInForm = (req, res) => {
  res.render("signin");
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from MongoDB
    res.render("usersInfo", { title: "User List", users }); // Pass users to EJS template
  } catch (err) {
    console.error("Error Fetching Users:", err);
    res.status(500).send("Error retrieving users.");
  }
};

exports.signInUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Find user in database (Remove role from query)
    const user = await User.findOne({ username });

    if (!user) {
      return res.render("signin", { errorMessage: "❌ Invalid username" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("signin", {
        errorMessage: "❌ Password doesn't match",
        username,
      });
    }

    // ✅ Check user role and redirect accordingly
    if (user.role === "admin") {
      res.render("adminPortal", { username });
    }

    if (user.role === "user") {
      // ✅ Store user session
      req.session.user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      console.log("✅ User logged in:", req.session.user);

      // ✅ Fetch user's bookings
      const userBookings = await Booking.find({ user: user._id }).populate(
        "user"
      );

      // ✅ Force session to save & redirect to user portal
      req.session.save((err) => {
        if (err) {
          console.error("❌ Error saving session:", err);
          return res.status(500).send("Internal Server Error");
        }

        // ✅ Render user portal AFTER session is saved
        res.render("userPortal", { user, bookings: userBookings });
      });
    }
  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).send("Internal Server Error");
  }
};

exports.showEditForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.render("edit", { user });
  } catch (err) {
    console.error("Error Fetching User for Edit:", err);
    res.status(500).send("Error retrieving user.");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { email, username } = req.body;
    const userId = req.params.id;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).send("user already exists");
    }
    await User.findByIdAndUpdate(req.params.id, { email, username });
    console.log(` User Updated: ${req.params.id}`);
    res.redirect("usersInfo");
  } catch (err) {
    console.error("Error Updating User:", err);
    res.status(500).send("Error updating user.");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);

    if (!deleteUser) {
      return res.status(400).send("user doest exists");
    }
    console.log(`User Deleted: ${req.params.id}`);
    res.redirect("usersInfo");
  } catch (err) {
    console.error("Error Deleting User:", err);
    res.status(500).send("Error deleting user.");
  }
};

exports.logout = (req, res) => {
  if (!req.session?.user && !req.cookies?.token) {
    return res.redirect("/welcome");
  }
  req.session?.destroy(() => {});
  res.clearCookie("token");
  res.redirect("/welcome");
};
exports.viewContactPage = (req, res) => {
  res.render("contactUs");
};
