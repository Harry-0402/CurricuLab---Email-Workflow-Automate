const supabase = require('./db');
const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, '../data/state.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(STATE_FILE))) {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
}

function getLastChecked() {
    if (fs.existsSync(STATE_FILE)) {
        const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        return data.last_checked;
    }
    // Default to 24 hours ago if no state exists
    return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
}

function updateLastChecked(timestamp) {
    fs.writeFileSync(STATE_FILE, JSON.stringify({ last_checked: timestamp }, null, 2));
}

async function fetchNewChanges() {
    const lastChecked = getLastChecked();
    console.log(`Checking for changes since: ${lastChecked}`);

    const { data, error } = await supabase
        .from('change_logs')
        .select('*')
        .gt('timestamp', lastChecked)
        .in('entity_type', ['Announcement', 'Assignment', 'Vault Resource', 'Revision Note'])
        .order('timestamp', { ascending: true });

    if (error) {
        console.error('Error fetching changes:', error);
        return [];
    }

    if (data.length > 0) {
        // Update state to the timestamp of the last item found
        const newestTimestamp = data[data.length - 1].timestamp;
        updateLastChecked(newestTimestamp);
    }

    return data;
}

module.exports = { fetchNewChanges };
