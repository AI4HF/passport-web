// server.js
const path = require('path');
const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

// Express build and port settings
const app = express();
const DIST = path.join(__dirname, 'dist', 'ai4hf-passport-web');
const PORT = process.env.PORT || 4200;

app.disable('x-powered-by');

app.use(bodyParser.json({ limit: '2000mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '2000mb' }));

// Endpoint living under Angular port to generate pdfs with a plain relative call
app.post('/generate-pdf', async (req, res) => {
    const { htmlContent } = req.body;
    if (!htmlContent) return res.status(400).send('Missing htmlContent');

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Load the provided HTML and wait for resources
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 2 });
        await page.emulateMediaType('screen');

        const pdfBuffer = await page.pdf({
            printBackground: true,
            width: '420mm',
            height: '297mm',
            landscape: true
        });

        // Return the raw PDF bytes
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=passport.pdf');
        res.setHeader('Content-Length', String(pdfBuffer.length));
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

        return res.status(200).end(pdfBuffer);
    } catch (err) {
        console.error('PDF generation error:', err);
        return res.status(500).send('Failed to generate PDF');
    } finally {
        if (browser) {
            try { await browser.close(); } catch (_) {}
        }
    }
});

// Static Angular app
app.use(express.static(DIST));

app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, () =>
    console.log(`PDF service running under Angular`)
);
