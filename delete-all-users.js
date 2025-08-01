import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
try {
  const serviceAccount = JSON.parse(
    readFileSync(path.join(__dirname, 'firebase-service-account.json'), 'utf8')
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'resqfood-27b66'
  });

  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
  console.log('\nPlease make sure you have:');
  console.log('1. Downloaded the service account key from Firebase Console');
  console.log('2. Saved it as "firebase-service-account.json" in your project root');
  process.exit(1);
}

async function deleteAllUsers() {
  try {
    console.log('Starting to delete all users...');
    
    let deletedCount = 0;
    let nextPageToken;
    
    do {
      // List users in batches of 1000 (Firebase limit)
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      
      if (listUsersResult.users.length === 0) {
        console.log('No users found to delete.');
        break;
      }
      
      // Extract UIDs
      const uids = listUsersResult.users.map(user => user.uid);
      
      console.log(`Found ${uids.length} users in this batch. Deleting...`);
      
      // Delete users in batch
      const deleteUsersResult = await admin.auth().deleteUsers(uids);
      
      deletedCount += deleteUsersResult.successCount;
      
      if (deleteUsersResult.failureCount > 0) {
        console.log(`Failed to delete ${deleteUsersResult.failureCount} users:`);
        deleteUsersResult.errors.forEach((err) => {
          console.log(`- ${err.error.message} (UID: ${err.index})`);
        });
      }
      
      console.log(`Successfully deleted ${deleteUsersResult.successCount} users in this batch`);
      
      nextPageToken = listUsersResult.pageToken;
      
    } while (nextPageToken);
    
    console.log(`\n✅ Deletion complete! Total users deleted: ${deletedCount}`);
    
  } catch (error) {
    console.error('❌ Error deleting users:', error.message);
  }
}

// Confirmation prompt
console.log('⚠️  WARNING: This will delete ALL users from your Firebase project!');
console.log('Project ID: resqfood-27b66');
console.log('\nThis action cannot be undone.');

// Simple confirmation (you can make this more sophisticated)
const args = process.argv.slice(2);
if (args.includes('--confirm')) {
  deleteAllUsers().then(() => {
    console.log('Script completed.');
    process.exit(0);
  });
} else {
  console.log('\nTo proceed, run: node delete-all-users.js --confirm');
  process.exit(0);
}