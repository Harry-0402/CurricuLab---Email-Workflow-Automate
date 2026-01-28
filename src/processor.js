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
                if (action === 'DELETE') {
                    notification.description = 'This announcement has been retracted/removed.';
                } else if (action === 'UPDATE') {
                    notification.description = `(Edited) ${payload.message || payload.description || 'The announcement has been updated.'}`;
                } else {
                    notification.description = payload.message || payload.description || 'Check the dashboard for details.';
                }
                break;

            case 'Assignment':
                notification.title = `${actionEmoji} ${actionPrefix} Assignment: ${payload.title || 'Unknown Assignment'}`;
                let subjectInfo = `Project/Subject: ${payload.subjectId || 'General'}`;

                if (action === 'DELETE') {
                    notification.description = `${subjectInfo}\n\n⚠️ This assignment has been removed from the coursework.`;
                } else if (action === 'UPDATE') {
                    notification.description = `${subjectInfo}\n\n🔄 Updates have been made to this assignment. Please check the dashboard for new instructions or due dates.`;
                } else {
                    notification.description = `${subjectInfo}\n\n✨ A new assignment has been posted.`;
                }
                break;

            case 'Vault Resource':
                const resourceType = payload.type === 'study_note' ? 'Study Note' : 'Resource';
                notification.title = `${actionEmoji} ${actionPrefix} ${resourceType}: ${payload.title || 'Untitled'}`;

                if (action === 'DELETE') {
                    notification.description = `The ${resourceType.toLowerCase()} "${payload.title}" has been deleted from the Vault.`;
                } else if (action === 'UPDATE') {
                    notification.description = `The ${resourceType.toLowerCase()} has been updated.`;
                } else {
                    notification.description = `New ${resourceType.toLowerCase()} uploaded to the Vault.`;
                }
                break;

            case 'Revision Note':
                notification.title = `${actionEmoji} ${actionPrefix} Revision Note: ${payload.title || 'Untitled'}`;

                if (action === 'DELETE') {
                    notification.description = `The revision note "${payload.title}" has been removed.`;
                } else if (action === 'UPDATE') {
                    notification.description = `The revision note "${payload.title}" has been updated.`;
                } else {
                    notification.description = `New revision note available: "${payload.title || 'Untitled'}". Check the dashboard to review properly.`;
                }
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
