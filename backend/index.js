const express = require("express");
const cors = require("cors");
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Routes
const textRoutes = require("./routes/textRoutes");
const toolRoutes = require("./routes/toolRoutes");
const pdfRoutes = require("./routes/pdfRoutes");

app.use("/api/pdf", pdfRoutes);
app.use("/api/text", textRoutes);
app.use("/api/tools", toolRoutes);



// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Tools Platform API is running' });
});

app.listen(PORT, () => {
    // console.log("Server running on port 5000");
    console.log(`🚀 Backend running on http://localhost:${PORT}`);

});