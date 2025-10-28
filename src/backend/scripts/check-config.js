/**
 * Configuration Checker Script
 * Run this to verify your backend is configured correctly
 * 
 * Usage: node scripts/check-config.js
 */

require('dotenv').config();

console.log('\n========================================');
console.log('📋 BookCafe Backend Configuration Check');
console.log('========================================\n');

let hasErrors = false;
let hasWarnings = false;

// Required environment variables
const required = {
  'MONGODB_URI': process.env.MONGODB_URI,
  'SESSION_SECRET': process.env.SESSION_SECRET,
  'FRONTEND_URL': process.env.FRONTEND_URL,
};

// Optional environment variables
const optional = {
  'PORT': process.env.PORT,
  'NODE_ENV': process.env.NODE_ENV,
  'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID,
  'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET,
  'GOOGLE_CALLBACK_URL': process.env.GOOGLE_CALLBACK_URL,
};

// Check required variables
console.log('🔍 Required Configuration:\n');
for (const [key, value] of Object.entries(required)) {
  if (!value) {
    console.log(`  ❌ ${key}: NOT SET (Required)`);
    hasErrors = true;
  } else {
    // Mask sensitive values
    const maskedValue = key.includes('SECRET') || key.includes('URI') 
      ? value.substring(0, 10) + '...' 
      : value;
    console.log(`  ✅ ${key}: ${maskedValue}`);
  }
}

// Check optional variables
console.log('\n🔍 Optional Configuration:\n');
for (const [key, value] of Object.entries(optional)) {
  if (!value) {
    console.log(`  ⚠️  ${key}: NOT SET (Using default)`);
    if (key.includes('GOOGLE')) {
      hasWarnings = true;
    }
  } else {
    const maskedValue = key.includes('SECRET') || key.includes('ID')
      ? value.substring(0, 10) + '...' 
      : value;
    console.log(`  ✅ ${key}: ${maskedValue}`);
  }
}

// Check for common mistakes
console.log('\n🔍 Configuration Validation:\n');

// Check PORT
const port = process.env.PORT || '5001';
if (port === '5000') {
  console.log('  ⚠️  PORT is set to 5000, but frontend expects 5001');
  hasWarnings = true;
} else {
  console.log(`  ✅ PORT: ${port}`);
}

// Check SESSION_SECRET
if (process.env.SESSION_SECRET && (
  process.env.SESSION_SECRET.includes('change-this') ||
  process.env.SESSION_SECRET.includes('your-') ||
  process.env.SESSION_SECRET.length < 20
)) {
  console.log('  ⚠️  SESSION_SECRET should be changed to a strong random value');
  hasWarnings = true;
} else if (process.env.SESSION_SECRET) {
  console.log('  ✅ SESSION_SECRET: Looks good');
}

// Check MONGODB_URI format
if (process.env.MONGODB_URI) {
  if (!process.env.MONGODB_URI.startsWith('mongodb://') && 
      !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    console.log('  ❌ MONGODB_URI should start with mongodb:// or mongodb+srv://');
    hasErrors = true;
  } else {
    console.log('  ✅ MONGODB_URI: Format looks correct');
  }
}

// Check Google OAuth completeness
const hasGoogleId = !!process.env.GOOGLE_CLIENT_ID;
const hasGoogleSecret = !!process.env.GOOGLE_CLIENT_SECRET;
const hasGoogleCallback = !!process.env.GOOGLE_CALLBACK_URL;

if ((hasGoogleId || hasGoogleSecret) && !(hasGoogleId && hasGoogleSecret)) {
  console.log('  ⚠️  Google OAuth partially configured - set both CLIENT_ID and CLIENT_SECRET');
  hasWarnings = true;
} else if (hasGoogleId && hasGoogleSecret) {
  console.log('  ✅ Google OAuth: Fully configured');
}

// Test MongoDB connection
console.log('\n🔍 Testing MongoDB Connection:\n');
const mongoose = require('mongoose');

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('  ✅ MongoDB: Connection successful!\n');
    
    // Print summary
    printSummary();
    
    mongoose.connection.close();
    process.exit(hasErrors ? 1 : 0);
  })
  .catch((err) => {
    console.log('  ❌ MongoDB: Connection failed');
    console.log(`     Error: ${err.message}\n`);
    
    console.log('  💡 Common solutions:');
    console.log('     - Make sure MongoDB is running');
    console.log('     - Check MONGODB_URI is correct');
    console.log('     - Verify network connectivity\n');
    
    hasErrors = true;
    printSummary();
    process.exit(1);
  });
} else {
  console.log('  ❌ Cannot test - MONGODB_URI not set\n');
  printSummary();
  process.exit(1);
}

function printSummary() {
  console.log('========================================');
  console.log('📊 Summary\n');
  
  if (hasErrors) {
    console.log('  ❌ Configuration has ERRORS - fix required variables');
    console.log('  📖 See: SETUP_TROUBLESHOOTING.md\n');
  } else if (hasWarnings) {
    console.log('  ⚠️  Configuration has warnings - some features may not work');
    console.log('  💡 Google OAuth not configured - email/password auth only\n');
  } else {
    console.log('  ✅ Configuration looks good! Ready to start.\n');
    console.log('  🚀 Run: npm run dev\n');
  }
  
  console.log('========================================\n');
}
