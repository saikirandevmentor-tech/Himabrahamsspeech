const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const crypto = require("crypto");

const upload = multer({ dest: "uploads/" });

// ─── Helper: cleanup ─────────────────────────────
function cleanup(...files) {
    files.forEach((f) => {
        if (f && fs.existsSync(f)) fs.unlinkSync(f);
    });
}

// ─── Generic Image Conversion ────────────────────
async function convertImage(req, res, toFormat, mimeType) {
    // const inputPath = req.file ? .path;
    let inputPath;

    if (req.file) {
        inputPath = req.file.path;
    } else {
        inputPath = null;
    }
    if (!inputPath) return res.status(400).json({ error: "No image uploaded" });

    const outputPath = `uploads/converted_${Date.now()}.${toFormat}`;

    try {
        let pipeline = sharp(inputPath);

        if (toFormat === "jpg" || toFormat === "jpeg") {
            pipeline = pipeline.jpeg({ quality: 92 });
        } else if (toFormat === "png") {
            pipeline = pipeline.png({ compressionLevel: 8 });
        } else if (toFormat === "webp") {
            pipeline = pipeline.webp({ quality: 90 });
        }

        await pipeline.toFile(outputPath);

        res.setHeader("Content-Type", mimeType);
        res.download(outputPath, `converted.${toFormat}`, () => {
            cleanup(inputPath, outputPath);
        });
    } catch (err) {
        console.error("image convert error:", err);
        cleanup(inputPath);
        res.status(500).json({ error: "Conversion failed", detail: err.message });
    }
}

//
// ─── IMAGE TOOLS ─────────────────────────────────
//

// JPG → PNG
router.post("/jpg-to-png", upload.single("image"), (req, res) => {
    convertImage(req, res, "png", "image/png");
});

// PNG → JPG
router.post("/png-to-jpg", upload.single("image"), (req, res) => {
    convertImage(req, res, "jpg", "image/jpeg");
});

// JPG → JPEG
router.post("/jpg-to-jpeg", upload.single("image"), (req, res) => {
    convertImage(req, res, "jpeg", "image/jpeg");
});

// JPEG → JPG
router.post("/jpeg-to-jpg", upload.single("image"), (req, res) => {
    convertImage(req, res, "jpg", "image/jpeg");
});

//
// ─── COMPRESS IMAGE ──────────────────────────────
//
router.post("/compress-image", upload.single("image"), async(req, res) => {
    // const inputPath = req.file ? .path;
    let inputPath;

    if (req.file) {
        inputPath = req.file.path;
    } else {
        inputPath = null;
    }
    if (!inputPath) return res.status(400).json({ error: "No image uploaded" });

    const quality = Math.min(100, Math.max(10, parseInt(req.body.quality) || 80));
    const mime = req.file.mimetype;
    const ext =
        mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";

    const outputPath = `uploads/compressed_${Date.now()}.${ext}`;

    try {
        let pipeline = sharp(inputPath);

        if (ext === "jpg") {
            pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        } else if (ext === "png") {
            const compression = Math.round((100 - quality) / 11);
            pipeline = pipeline.png({
                compressionLevel: compression,
                adaptiveFiltering: true,
            });
        } else if (ext === "webp") {
            pipeline = pipeline.webp({ quality });
        }

        await pipeline.toFile(outputPath);

        res.setHeader("Content-Type", mime);
        res.download(outputPath, `compressed.${ext}`, () => {
            cleanup(inputPath, outputPath);
        });
    } catch (err) {
        console.error("compress-image error:", err);
        cleanup(inputPath);
        res.status(500).json({ error: "Compression failed", detail: err.message });
    }
});

//
// ─── GENERATORS ──────────────────────────────────
//

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