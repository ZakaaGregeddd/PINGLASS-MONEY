// backend/utils/database.js
// Supabase Database Client

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Client untuk frontend (dengan row level security)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client untuk backend admin operations (bypass RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('⚠️  Database connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
    return false;
  }
}

// Call test on startup
testConnection();

module.exports = {
  supabase,
  supabaseAdmin
};
