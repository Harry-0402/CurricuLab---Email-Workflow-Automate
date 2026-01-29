const { fetchNewChanges } = require('./src/fetcher');
const supabase = require('./src/db');

async function verify() {
    console.log('--- Verification Start ---');
    console.log('1. Fetching changes (should default to 24h ago if empty, or read from DB)');

    // This will trigger getLastChecked() which reads from DB
    await fetchNewChanges();

    console.log('\n2. Manually checking DB for state...');
    const { data } = await supabase
        .from('app_data')
        .select('*')
        .eq('key', 'email_bot_state')
        .single();

    if (data) {
        console.log('SUCCESS: State found in DB:', data);
    } else {
        console.log('WARNING: No state found in DB yet (might be expected if no new changes were found).');

        // Force an update to test write permissions
        console.log('Attempting forced write...');
        const timestamp = new Date().toISOString();
        const { error } = await supabase
            .from('app_data')
            .upsert({
                key: 'email_bot_state',
                data: { last_checked: timestamp }
            }, { onConflict: 'key' });

        if (error) {
            console.error('FAILURE: Could not write to DB:', error.message);
        } else {
            console.log('SUCCESS: Forced write successful:', timestamp);
        }
    }
    console.log('--- Verification End ---');
}

verify();
