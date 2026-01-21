const supabase = require('../src/db');

async function debugSchema() {
    console.log('Fetching one row from change_logs...');
    const { data, error } = await supabase
        .from('change_logs')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Row structure:', data.length > 0 ? Object.keys(data[0]) : 'Table is empty');
        if (data.length > 0) {
            console.log('Sample Data:', data[0]);
        }
    }
}

debugSchema();
