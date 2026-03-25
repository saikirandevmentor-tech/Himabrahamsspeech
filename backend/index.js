const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const textRoutes = require("./routes/textRoutes");
const toolRoutes = require("./routes/toolRoutes");
const pdfRoutes = require("./routes/pdfRoutes");

app.use("/api/pdf", pdfRoutes);
app.use("/api/text", textRoutes);
app.use("/api/tools", toolRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});