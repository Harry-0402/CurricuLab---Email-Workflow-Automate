function processChange(change) {
    const { entity_type, action, changes } = change;
    const payload = typeof changes === 'string' ? JSON.parse(changes) : changes;

    let actionPrefix = 'New';
    let actionEmoji = '✨';

    if (action === 'UPDATE') {
        actionPrefix = 'Updated';
        actionEmoji = '🔄';
    } else if (action === 'DELETE') {
        actionPrefix = 'Removed';
        actionEmoji = '🗑️';
    }

    let notification = {
        type: entity_type,
        action: action,
        title: `${actionEmoji} ${actionPrefix} ${entity_type}`,
        description: '',
        url: '',
        timestamp: change.timestamp
    };

    try {
        switch (entity_type) {
            case 'Announcement':
                notification.title = `${actionEmoji} ${actionPrefix} Announcement: ${payload.title || 'No Title'}`;
                notification.description = payload.message || payload.description || 'Check the dashboard for details.';
                break;

            case 'Assignment':
                notification.title = `${actionEmoji} ${actionPrefix} Assignment: ${payload.title || 'Unknown Assignment'}`;
                notification.description = `Project/Subject: ${payload.subjectId || 'General'}`;
                break;

            case 'Vault Resource':
                const resourceType = payload.type === 'study_note' ? 'Study Note' : 'Resource';
                notification.title = `${actionEmoji} ${actionPrefix} ${resourceType}: ${payload.title || 'Untitled'}`;
                notification.description = 'A resource has been modified in the Vault.';
                break;

            default:
                notification.title = `${actionEmoji} ${actionPrefix} ${entity_type}`;
        }
    } catch (err) {
        console.error('Error processing payload:', err);
    }

    return notification;
}

module.exports = { processChange };
