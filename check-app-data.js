const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkAppData() {
    console.log('Checking app_data table...');

    const { data, error } = await supabase
        .from('app_data')
        .select('*')
        .limit(5);

    if (error) {
        console.log('Error accessing app_data:', error.message);
    } else {
        console.log('app_data records found:', data.length);
        if (data.length > 0) {
            console.log('Sample record keys:', Object.keys(data[0]));
            console.log('Sample record:', JSON.stringify(data[0], null, 2));
        } else {
            console.log('app_data is empty.');
            // Try to insert a test record to see if it works and what columns are required
            // We'll guess common columns like 'key', 'value', 'id'
            console.log('Table exists but is empty. Cannot determine schema without introspection or guessing.');
        }
    }
}

checkAppData();
