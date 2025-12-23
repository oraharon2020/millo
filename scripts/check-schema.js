const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tlzyscjvkgvlmveyfpup.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsenlzY2p2a2d2bG12ZXlmcHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MzIzNDIsImV4cCI6MjA4MjAwODM0Mn0.MKhDTF8N1adS-Xx6b8jZSlo-B2aBVwuRB2sM9VFlWWY'
);

async function checkSchema() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Available columns:', Object.keys(data[0]));
  } else {
    console.log('No data found to check schema');
  }
}

checkSchema();