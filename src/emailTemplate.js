/**
 * Generates a responsive HTML email template for notifications.
 * @param {Object} notification - The notification object.
 * @param {string} notification.title - The title of the notification.
 * @param {string} notification.type - The type of notification (e.g., Assignment, Announcement).
 * @param {string} notification.description - The body of the notification.
 * @param {string|Date} notification.timestamp - The timestamp of the event.
 * @returns {string} The complete HTML string.
 */
function generateEmailHtml(notification) {
    const primaryColor = '#2563eb'; // Blue-600
    const backgroundColor = '#f8fafc'; // Slate-50
    const cardColor = '#ffffff';
    const textColor = '#1e293b'; // Slate-800
    const mutedColor = '#64748b'; // Slate-500
    const borderColor = '#e2e8f0'; // Slate-200

    const dateStr = new Date(notification.timestamp).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${notification.title}</title>
    <style>
        body { margin: 0; padding: 0; background-color: ${backgroundColor}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .wrapper { width: 100%; table-layout: fixed; background-color: ${backgroundColor}; padding-bottom: 40px; }
        .main { background-color: ${cardColor}; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background-color: ${primaryColor}; padding: 24px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 32px 24px; }
        .badge { display: inline-block; background-color: #e0f2fe; color: ${primaryColor}; padding: 6px 12px; border-radius: 9999px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
        .title { color: ${textColor}; margin: 0 0 16px 0; font-size: 20px; font-weight: 700; line-height: 1.4; }
        .meta { color: ${mutedColor}; font-size: 14px; margin-bottom: 24px; border-bottom: 1px solid ${borderColor}; padding-bottom: 24px; }
        .description { color: ${textColor}; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap; }
        .footer { text-align: center; padding: 24px; color: ${mutedColor}; font-size: 12px; }
        .footer p { margin: 4px 0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div style="height: 40px;"></div>
        <div class="main">
            <div class="header">
                <h1>CurricuLab</h1>
            </div>
            <div class="content">
                <span class="badge">${notification.type}</span>
                <h2 class="title">${notification.title}</h2>
                <div class="meta">
                    📅 ${dateStr}
                </div>
                <div class="description">
                    ${notification.description}
                </div>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated notification from your CurricuLab Agent.</p>
            <p>&copy; ${new Date().getFullYear()} CurricuLab</p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

module.exports = { generateEmailHtml };
