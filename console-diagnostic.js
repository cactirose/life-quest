// Quick diagnostic check - paste this into browser console while on the app

console.log("=== Life Quest Data Sync Diagnostics ===");

// 1. Check authentication
const token = localStorage.getItem('supabase.auth.token');
if (token) {
  try {
    const session = JSON.parse(token);
    const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
    const now = new Date();
    console.log("✅ Session found");
    console.log(`Expires: ${expiresAt?.toISOString()}`);
    console.log(`Valid: ${expiresAt && expiresAt > now ? 'Yes' : 'EXPIRED'}`);
  } catch (e) {
    console.log("❌ Invalid session format");
  }
} else {
  console.log("❌ No session found");
}

// 2. Check pending syncs
const pendingSync = localStorage.getItem('pendingSync');
if (pendingSync) {
  console.log("⚠️ Pending sync found:", JSON.parse(pendingSync));
} else {
  console.log("✅ No pending syncs");
}

// 3. Check network
console.log(`Network: ${navigator.onLine ? 'Online' : 'Offline'}`);

console.log("=== End Diagnostics ===");
