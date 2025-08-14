const express = require("express");
const authController = require("./../controllers/authController");
const debtEntryController = require("./../controllers/debtEntryController");

const router = express.Router();

router.use(authController.protect);
router.post("/", debtEntryController.createDebtEntry);
router.patch("/:id", debtEntryController.updateDebtEntry);
router.delete("/:id", debtEntryController.softDeleteDebtEntry);
router.get("/me", debtEntryController.getAllDebtEntryOfLoggedInUser);

module.exports = router;
