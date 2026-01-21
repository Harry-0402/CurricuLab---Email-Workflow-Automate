const { sendNotification } = require('../src/notifier');

async function main() {
    console.log(`[${new Date().toISOString()}] --- Sending Attendance Reminder ---`);

    try {
        const notification = {
            title: 'Action Required: Log Attendance',
            type: 'Reminder',
            description: 'This is a friendly reminder to log your daily attendance in the CurricuLab system. Please ensure your profile is up to date for today.',
            timestamp: new Date().toISOString()
        };

        // Reuse the existing notification system which handles authorized users fetching and email templating
        await sendNotification(notification);

    } catch (error) {
        console.error('Fatal Error sending reminder:', error);
        process.exit(1);
    }

    console.log('--- Reminder Process Finished ---');
}

main();
