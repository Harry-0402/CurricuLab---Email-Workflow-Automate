const cron = require('node-cron');
const http = require('http');
const { fetchNewChanges } = require('../src/fetcher');
const { processChange } = require('../src/processor');
const { sendNotification } = require('../src/notifier');

// Data for health check
let lastRun = 'Never';
let lastStatus = 'Idle';

// Create a simple HTTP server for health checks (Render requirement)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`CurricuLab Agent is Running.\nLast Run: ${lastRun}\nStatus: ${lastStatus}`);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Health check server listening on port ${PORT}`);
});

async function runCheck() {
    lastRun = new Date().toISOString();
    lastStatus = 'Checking...';
    console.log(`[${lastRun}] --- Starting Check ---`);

    try {
        const changes = await fetchNewChanges();

        if (changes.length === 0) {
            console.log('No new changes found.');
            lastStatus = 'Idle (No changes)';
            return;
        }

        console.log(`Found ${changes.length} new changes.`);

        for (const change of changes) {
            const notification = processChange(change);
            await sendNotification(notification);
        }

    } catch (error) {
        console.error('Fatal Error:', error);
    }

    console.log('--- Check Finished ---');
}

// Run immediately on start
runCheck();

// Schedule to run every 10 minutes
cron.schedule('*/10 * * * *', () => {
    runCheck();
});

console.log('--- Watcher Service Started (Running every 10 mins) ---');
