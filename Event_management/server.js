require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const session = require("express-session");

connectDB();
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "Priya@1234",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.urlencoded({ extended: true }));
app.get("/welcome", (req, res) => {
  res.render("welcome");
});

app.use("/users", userRoutes);
app.use("/booking", bookingRoutes);

app.get("/", (req, res) => {
  res.render("welcome");
});

app.listen(3010, () => console.log("server running at http://localhost:3010"));
