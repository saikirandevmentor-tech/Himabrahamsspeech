const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

// Image → PDF
router.post("/image-to-pdf", upload.single("image"), async(req, res) => {
    const filePath = req.file.path;

    const pdfDoc = await PDFDocument.create();
    const imageBytes = fs.readFileSync(filePath);

    let image;
    if (req.file.mimetype === "image/png") {
        image = await pdfDoc.embedPng(imageBytes);
    } else {
        image = await pdfDoc.embedJpg(imageBytes);
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
    });

    const pdfBytes = await pdfDoc.save();

    fs.unlinkSync(filePath); // delete uploaded file

    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBytes));
});

module.exports = router;