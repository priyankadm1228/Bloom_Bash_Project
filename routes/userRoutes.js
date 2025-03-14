const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/signup", userController.showSignUpForm);
router.post("/signup", userController.signUpUser);
router.get("/signin", userController.showSignInForm);
router.post("/signin", userController.signInUser);
router.get("/usersInfo", userController.getAllUsers);
router.get("/:id/edit", userController.showEditForm);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/logout", userController.logout);
router.get("/contactUs", userController.viewContactPage);

module.exports = router;
