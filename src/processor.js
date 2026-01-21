function processChange(change) {
    const { entity_type, action, changes } = change;
    const payload = typeof changes === 'string' ? JSON.parse(changes) : changes;

    let notification = {
        type: entity_type,
        action: action,
        title: 'New Update',
        description: '',
        url: '',
        timestamp: change.timestamp
    };

    try {
        switch (entity_type) {
            case 'Announcement':
                notification.title = `📢 Default Announcement: ${payload.title || 'No Title'}`;
                notification.description = payload.message || payload.description || 'Check the dashboard for details.';
                break;

            case 'Assignment':
                notification.title = `📝 New Assignment: ${payload.title || 'Unknown Assignment'}`;
                notification.description = `Project/Subject: ${payload.subjectId || 'General'}`;
                break;

            case 'Vault Resource':
                const resourceType = payload.type === 'study_note' ? 'Study Note' : 'Resource';
                notification.title = `📚 New ${resourceType}: ${payload.title || 'Untitled'}`;
                notification.description = 'A new resource has been uploaded to the Vault.';
                break;

            default:
                notification.title = `Update in ${entity_type}`;
        }
    } catch (err) {
        console.error('Error processing payload:', err);
    }

    return notification;
}

module.exports = { processChange };
