const express = require("express");
const router = express.Router();

// Password Generator
router.get("/password", (req, res) => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }

    res.json({ password });
});

// UUID Generator
router.get("/uuid", (req, res) => {
    const uuid = crypto.randomUUID();
    res.json({ uuid });
});

module.exports = router;