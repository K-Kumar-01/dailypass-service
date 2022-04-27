const { Router } = require("express");
const {
  pushNewSeries,
  pushNewUser,
  unlockChapter,
  getDetails,
} = require("../controllers/dailyPass");

const router = Router();

router.put("/series", pushNewSeries);
router.put("/unlock", unlockChapter);
router.put("/user", pushNewUser);
router.get("/details", getDetails);

module.exports = router;
