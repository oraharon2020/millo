// Script to create the first admin user
// Run with: node scripts/create-admin.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tlzyscjvkgvlmveyfpup.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.log('\n⚠️  SUPABASE_SERVICE_ROLE_KEY not found in environment.\n');
  console.log('To create an admin user, you have two options:\n');
  
  console.log('Option 1: Via Supabase Dashboard');
  console.log('================================');
  console.log('1. Go to: https://supabase.com/dashboard/project/tlzyscjvkgvlmveyfpup/auth/users');
  console.log('2. Click "Add user" → "Create new user"');
  console.log('3. Enter:');
  console.log('   Email: or.aharon2020@gmail.com');
  console.log('   Password: Aharon1994!');
  console.log('4. Click "Create user"');
  console.log('5. Then run this SQL in SQL Editor:');
  console.log('   UPDATE profiles SET role = \'admin\' WHERE email = \'or.aharon2020@gmail.com\';\n');
  
  console.log('Option 2: Via this script');
  console.log('=========================');
  console.log('1. Go to: https://supabase.com/dashboard/project/tlzyscjvkgvlmveyfpup/settings/api');
  console.log('2. Copy the "service_role" key (secret)');
  console.log('3. Run: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/create-admin.js\n');
  
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  const email = 'or.aharon2020@gmail.com';
  const password = 'Aharon1994!';
  const fullName = 'Or Aharon';

  console.log('Creating admin user...\n');

  try {
    // Create user
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: 'admin'
      }
    });

    if (createError) {
      if (createError.message.includes('already been registered')) {
        console.log('User already exists. Updating role to admin...');
        
        // Get user by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          // Update profile to admin
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin', full_name: fullName })
            .eq('id', existingUser.id);
          
          if (updateError) throw updateError;
          console.log('✅ User role updated to admin!');
        }
      } else {
        throw createError;
      }
    } else {
      console.log('✅ User created successfully!');
      
      // Update profile to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin', full_name: fullName })
        .eq('id', user.user.id);
      
      if (updateError) {
        console.log('Note: Profile update pending - trigger will create it');
      }
    }

    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Role: admin\n');
    console.log('You can now login at: http://localhost:3000/login');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

createAdminUser();
