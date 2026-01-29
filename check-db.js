const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkDb() {
    console.log('Checking for bot_state table...');

    // Try to select from a hypothetical 'bot_state' table
    const { data, error } = await supabase
        .from('bot_state')
        .select('*')
        .limit(1);

    if (error) {
        console.log('Error accessing bot_state (likely does not exist):', error.message);
    } else {
        console.log('bot_state table exists. Data:', data);
    }

    // Also check change_logs specifically to see structure
    const logs = await supabase.from('change_logs').select('*').limit(1);
    console.log('change_logs structure sample:', logs.data ? Object.keys(logs.data[0]) : 'No data');
}

checkDb();
