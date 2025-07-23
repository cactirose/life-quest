// Diagnostic tool for data saving issues
// Run this in the browser console to check for common issues

(function() {
  console.log("🔧 Life Quest Data Saving Diagnostic Tool");
  console.log("==========================================");
  
  // 1. Check authentication status
  console.log("\n1. Checking Authentication...");
  fetch('/api/auth/session')
    .then(() => console.log("✅ Auth endpoint reachable"))
    .catch(() => console.log("❌ Auth endpoint failed"));
  
  // 2. Check local storage for session
  const token = localStorage.getItem('supabase.auth.token');
  if (token) {
    try {
      const session = JSON.parse(token);
      const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
      const now = new Date();
      
      console.log("✅ Session found in localStorage");
      console.log(`   Expires: ${expiresAt ? expiresAt.toISOString() : 'Unknown'}`);
      console.log(`   Valid: ${expiresAt && expiresAt > now ? '✅ Yes' : '❌ No (expired)'}`);
    } catch (e) {
      console.log("❌ Invalid session format in localStorage");
    }
  } else {
    console.log("❌ No session found in localStorage");
  }
  
  // 3. Check network connectivity
  console.log("\n2. Checking Network Connectivity...");
  console.log(`   Online status: ${navigator.onLine ? '✅ Online' : '❌ Offline'}`);
  
  // 4. Check for pending sync operations
  const pendingSync = localStorage.getItem('pendingSync');
  if (pendingSync) {
    try {
      const pending = JSON.parse(pendingSync);
      const timestamp = new Date(pending.timestamp);
      console.log("\n3. Pending Sync Operations Found:");
      console.log(`   ⚠️  Failed sync from: ${timestamp.toISOString()}`);
      console.log(`   ⚠️  Age: ${((Date.now() - timestamp.getTime()) / 1000 / 60).toFixed(1)} minutes`);
    } catch (e) {
      console.log("\n3. ❌ Invalid pending sync data");
    }
  } else {
    console.log("\n3. ✅ No pending sync operations");
  }
  
  // 5. Check for error patterns in console
  console.log("\n4. Recent Error Analysis:");
  console.log("   Check the console above for these error patterns:");
  console.log("   🔍 'No authenticated user' - Session expired");
  console.log("   🔍 'network error' - Connectivity issues");
  console.log("   🔍 'timeout' - Slow connection or server issues");
  console.log("   🔍 'failed to save' - Database constraint violations");
  
  // 6. Supabase client status
  console.log("\n5. Testing Supabase Connection...");
  if (window.supabase || window._supabase) {
    const client = window.supabase || window._supabase;
    client.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          console.log("❌ Supabase auth error:", error.message);
        } else {
          console.log("✅ Supabase connection working");
          console.log(`   User ID: ${data.session?.user?.id || 'Not logged in'}`);
        }
      })
      .catch(err => {
        console.log("❌ Supabase connection failed:", err.message);
      });
  } else {
    console.log("❌ Supabase client not found in window object");
  }
  
  console.log("\n==========================================");
  console.log("🔧 Diagnostic Complete");
  console.log("📋 Copy this output to help debug the issue");
})();
