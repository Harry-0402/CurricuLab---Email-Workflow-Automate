const { fetchNewChanges } = require('../src/fetcher');
const { processChange } = require('../src/processor');
const { sendNotification } = require('../src/notifier');

async function main() {
    console.log(`[${new Date().toISOString()}] --- Starting One-Time Update Check ---`);

    try {
        const changes = await fetchNewChanges();

        if (changes.length === 0) {
            console.log('No new changes found.');
            return;
        }

        console.log(`Found ${changes.length} new changes.`);

        for (const change of changes) {
            const notification = processChange(change);
            await sendNotification(notification);
        }

    } catch (error) {
        console.error('Fatal Error:', error);
        process.exit(1); // Exit with error code for CI/CD to detect failure
    }

    console.log('--- Check Finished ---');
}

main();
