const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const supabase = require('./db');
const { generateEmailHtml } = require('./emailTemplate');

const LOG_FILE = path.join(__dirname, '../logs/notifications.log');

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

// Config for Email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function getAuthorizedEmails() {
    try {
        const { data, error } = await supabase
            .from('authorized_users')
            .select('email');

        if (error) {
            console.error('Error fetching authorized users:', error);
            return [];
        }

        return data.map(user => user.email).filter(email => email);
    } catch (err) {
        console.error('Unexpected error fetching emails:', err);
        return [];
    }
}

async function sendNotification(notification) {
    const message = `[${notification.timestamp}] [${notification.type}] ${notification.title} - ${notification.description}`;

    // 1. Console Log
    console.log(message);

    // 2. File Log
    fs.appendFileSync(LOG_FILE, message + '\n');

    // 3. Email Notification
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const recipients = await getAuthorizedEmails();

        if (recipients.length === 0) {
            console.log(' > Email skipped (No authorized users found)');
            return;
        }

        try {
            const htmlContent = generateEmailHtml(notification);
            const info = await transporter.sendMail({
                from: `"CurricuLab Agent" <${process.env.SMTP_USER}>`,
                bcc: recipients, // Use BCC to hide recipients from each other
                subject: `[CurricuLab] ${notification.title}`,
                html: htmlContent,
            });
            console.log(' > Email sent to %d recipients. MessageId: %s', recipients.length, info.messageId);
        } catch (error) {
            console.error('Failed to send Email:', error.message);
        }
    } else {
        console.log(' > Email skipped (SMTP_USER/PASS not set)');
    }
}

module.exports = { sendNotification };
