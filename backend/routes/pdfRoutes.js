const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { promisify } = require("util");
const { PDFDocument } = require("pdf-lib");

const execAsync = promisify(exec);
const upload = multer({ dest: "uploads/" });

// ─── Helper: cleanup temp files ─────────────────────────────
function cleanup(...files) {
    files.forEach((f) => {
        if (f && fs.existsSync(f)) fs.unlinkSync(f);
    });
}

//
// ─── IMAGE → PDF ────────────────────────────────────────────
//
router.post("/image-to-pdf", upload.single("image"), async(req, res) => {
    // const filePath = req.file ? .path;
    let filePath;

    if (req.file) {
        filePath = req.file.path;
    } else {
        filePath = null;
    }
    if (!filePath) return res.status(400).json({ error: "No image uploaded" });

    try {
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

        cleanup(filePath);

        res.setHeader("Content-Type", "application/pdf");
        res.send(Buffer.from(pdfBytes));
    } catch (err) {
        cleanup(filePath);
        res.status(500).json({ error: "Image to PDF failed" });
    }
});

//
// ─── PDF → WORD ─────────────────────────────────────────────
//
router.post("/pdf-to-word", upload.single("pdf"), async(req, res) => {
    // const inputPath = req.file ? .path;
    let inputPath;

    if (req.file) {
        inputPath = req.file.path;
    } else {
        inputPath = null;
    }
    if (!inputPath) return res.status(400).json({ error: "No PDF uploaded" });

    const outputDir = path.join("uploads", `word_${Date.now()}`);
    fs.mkdirSync(outputDir, { recursive: true });

    try {
        await execAsync(
            `libreoffice --headless --convert-to docx "${inputPath}" --outdir "${outputDir}"`,
        );

        const files = fs.readdirSync(outputDir).filter((f) => f.endsWith(".docx"));
        if (!files.length) throw new Error("No output file");

        const outputPath = path.join(outputDir, files[0]);

        res.download(outputPath, "converted.docx", () => {
            cleanup(inputPath, outputPath);
            fs.rmSync(outputDir, { recursive: true, force: true });
        });
    } catch (err) {
        cleanup(inputPath);
        fs.rmSync(outputDir, { recursive: true, force: true });
        res.status(500).json({ error: "PDF to Word failed", detail: err.message });
    }
});

//
// ─── PDF → IMAGE ────────────────────────────────────────────
//
router.post("/pdf-to-image", upload.single("pdf"), async(req, res) => {
    // const inputPath = req.file ? .path;
    let inputPath;

    if (req.file) {
        inputPath = req.file.path;
    } else {
        inputPath = null;
    }
    if (!inputPath) return res.status(400).json({ error: "No PDF uploaded" });

    const outputPrefix = path.join("uploads", `img_${Date.now()}`);

    try {
        await execAsync(`pdftoppm -png -r 150 "${inputPath}" "${outputPrefix}"`);

        const dir = path.dirname(outputPrefix);
        const base = path.basename(outputPrefix);

        const imgFiles = fs
            .readdirSync(dir)
            .filter((f) => f.startsWith(base) && f.endsWith(".png"))
            .sort();

        const images = imgFiles.map((f) => {
            const data = fs.readFileSync(path.join(dir, f));
            return `data:image/png;base64,${data.toString("base64")}`;
        });

        res.json({ images });

        cleanup(inputPath);
        imgFiles.forEach((f) => cleanup(path.join(dir, f)));
    } catch (err) {
        cleanup(inputPath);
        res.status(500).json({ error: "PDF to Image failed", detail: err.message });
    }
});

//
// ─── COMPRESS PDF ───────────────────────────────────────────
//
router.post("/compress-pdf", upload.single("pdf"), async(req, res) => {
    // const inputPath = req.file ? .path;
    let inputPath;

    if (req.file) {
        inputPath = req.file.path;
    } else {
        inputPath = null;
    }
    if (!inputPath) return res.status(400).json({ error: "No PDF uploaded" });

    const qualityMap = {
        low: "/screen",
        medium: "/ebook",
        high: "/printer",
    };

    const quality = qualityMap[req.body.quality] || "/ebook";
    const outputPath = `uploads/compressed_${Date.now()}.pdf`;

    try {
        await execAsync(
            `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${quality} ` +
            `-dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`,
        );

        res.download(outputPath, "compressed.pdf", () => {
            cleanup(inputPath, outputPath);
        });
    } catch (err) {
        cleanup(inputPath);
        res.status(500).json({ error: "Compression failed", detail: err.message });
    }
});

module.exports = router;