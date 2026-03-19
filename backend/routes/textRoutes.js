const express = require("express");
const router = express.Router();

router.post("/word-counter", (req, res) => {
    const { text } = req.body;

    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;

    res.json({ words, chars });
});

router.post("/handwriting", (req, res) => {
    const { text } = req.body;

    const styled = text.split("").join(" ");

    res.json({ result: styled });
});

module.exports = router;