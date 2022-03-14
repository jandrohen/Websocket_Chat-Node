const { Router } = require("express");
const {search} = require("../controllers/search.contoller");

const router = Router();

router.get("/:collection/:term",search);



module.exports = router;
