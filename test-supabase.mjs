import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read .env.local manually
const envContent = readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key) env[key.trim()] = value.join('=').trim();
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log('=== Supabase Connection Test ===\n');
  console.log('URL:', env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Key exists:', !!env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('');
  
  // Test DB connection
  console.log('1. Testing database connection...');
  const { data: projects, error: dbError } = await supabase
    .from('projects')
    .select('id')
    .limit(1);
  console.log('   Result:', dbError ? 'FAILED: ' + dbError.message : 'OK - Found ' + projects?.length + ' project(s)');
  
  // Test auth getSession
  console.log('\n2. Testing auth.getSession()...');
  const start = Date.now();
  const { data: sessionData, error: authError } = await supabase.auth.getSession();
  const duration = Date.now() - start;
  console.log('   Duration:', duration + 'ms');
  console.log('   Result:', authError ? 'FAILED: ' + authError.message : 'OK');
  console.log('   Session:', sessionData?.session ? 'EXISTS' : 'null (no logged in user)');
  
  // Check profiles table
  console.log('\n3. Checking profiles table...');
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .limit(5);
  
  if (profileError) {
    console.log('   FAILED:', profileError.message);
  } else {
    console.log('   Found', profiles?.length, 'profile(s):');
    profiles?.forEach(p => console.log('   -', p.email, '| role:', p.role));
  }
  
  console.log('\n=== Test Complete ===');
}

test().catch(console.error);
