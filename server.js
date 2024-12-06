const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from the frontend
app.use(express.json()); // Parse JSON bodies

// API endpoint to fetch rendered HTML
app.get('/browse', async (req, res) => {
    const url = req.query.url;

    // Validate URL
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true, // Run browser in headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for many hosting providers
        });
        const page = await browser.newPage();

        // Navigate to the requested URL
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Get the page content
        const content = await page.content();

        // Close the browser
        await browser.close();

        // Send the HTML back to the client
        res.send(content);
    } catch (error) {
        console.error('Error fetching page:', error);
        res.status(500).json({ error: 'Failed to load the page.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
