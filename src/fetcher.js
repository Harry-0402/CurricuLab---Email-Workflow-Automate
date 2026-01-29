const supabase = require('./db');

// Key used to store the bot's state in the app_data table
const STATE_KEY = 'email_bot_state';

async function getLastChecked() {
    try {
        const { data, error } = await supabase
            .from('app_data')
            .select('data')
            .eq('key', STATE_KEY)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error('Error fetching state from DB:', error.message);
        }

        if (data && data.data && data.data.last_checked) {
            return data.data.last_checked;
        }
    } catch (err) {
        console.error('Unexpected error fetching state:', err);
    }

    // Default to 24 hours ago if no state exists or error occurs
    console.log('No previous state found in DB, defaulting to 24 hours ago.');
    return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
}

async function updateLastChecked(timestamp) {
    try {
        const { error } = await supabase
            .from('app_data')
            .upsert({
                key: STATE_KEY,
                data: { last_checked: timestamp }
            }, { onConflict: 'key' });

        if (error) {
            console.error('Error updating state in DB:', error.message);
        } else {
            console.log(`State updated in DB: ${timestamp}`);
        }
    } catch (err) {
        console.error('Unexpected error updating state:', err);
    }
}

async function fetchNewChanges() {
    const lastChecked = await getLastChecked();
    console.log(`Checking for changes since: ${lastChecked}`);

    const { data, error } = await supabase
        .from('change_logs')
        .select('*')
        .gt('timestamp', lastChecked)
        .in('entity_type', ['Announcement', 'Assignment'])
        .order('timestamp', { ascending: true });

    if (error) {
        console.error('Error fetching changes:', error);
        return [];
    }

    if (data.length > 0) {
        // Update state to the timestamp of the last item found
        const newestTimestamp = data[data.length - 1].timestamp;
        await updateLastChecked(newestTimestamp);
    }

    return data;
}

module.exports = { fetchNewChanges };
