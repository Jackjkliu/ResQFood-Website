import admin from 'firebase-admin';
import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3004; // Different port to avoid conflicts

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
  console.log('Please ensure firebase-service-account.json exists in your project root');
}

app.use(express.json());
app.use(express.static(__dirname));

// Admin endpoint to delete all users
app.post('/admin/delete-all-users', async (req, res) => {
  try {
    console.log('Admin request: Delete all users');
    
    let deletedCount = 0;
    let nextPageToken;
    
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      
      if (listUsersResult.users.length === 0) {
        break;
      }
      
      const uids = listUsersResult.users.map(user => user.uid);
      const deleteUsersResult = await admin.auth().deleteUsers(uids);
      
      deletedCount += deleteUsersResult.successCount;
      nextPageToken = listUsersResult.pageToken;
      
    } while (nextPageToken);
    
    res.json({ 
      success: true, 
      message: `Successfully deleted ${deletedCount} users`,
      deletedCount 
    });
    
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete users', 
      error: error.message 
    });
  }
});

// Admin endpoint to list all users
app.get('/admin/list-users', async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers(1000);
    
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime
    }));
    
    res.json({ 
      success: true, 
      users,
      totalUsers: users.length 
    });
    
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to list users', 
      error: error.message 
    });
  }
});

// Simple admin interface
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>ResQFood Admin</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            button { padding: 10px 20px; margin: 10px; font-size: 16px; }
            .danger { background-color: #ff4444; color: white; border: none; }
            .info { background-color: #4444ff; color: white; border: none; }
            #result { margin-top: 20px; padding: 10px; border: 1px solid #ccc; }
        </style>
    </head>
    <body>
        <h1>ResQFood Admin Panel</h1>
        
        <button class="info" onclick="listUsers()">List All Users</button>
        <button class="danger" onclick="deleteAllUsers()">Delete All Users</button>
        
        <div id="result"></div>
        
        <script>
            async function listUsers() {
                try {
                    const response = await fetch('/admin/list-users');
                    const data = await response.json();
                    
                    if (data.success) {
                        document.getElementById('result').innerHTML = 
                            '<h3>Users (' + data.totalUsers + '):</h3>' +
                            '<pre>' + JSON.stringify(data.users, null, 2) + '</pre>';
                    } else {
                        document.getElementById('result').innerHTML = 
                            '<p style="color: red;">Error: ' + data.message + '</p>';
                    }
                } catch (error) {
                    document.getElementById('result').innerHTML = 
                        '<p style="color: red;">Error: ' + error.message + '</p>';
                }
            }
            
            async function deleteAllUsers() {
                if (!confirm('Are you sure you want to delete ALL users? This cannot be undone!')) {
                    return;
                }
                
                try {
                    const response = await fetch('/admin/delete-all-users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                        document.getElementById('result').innerHTML = 
                            '<p style="color: green;">' + data.message + '</p>';
                    } else {
                        document.getElementById('result').innerHTML = 
                            '<p style="color: red;">Error: ' + data.message + '</p>';
                    }
                } catch (error) {
                    document.getElementById('result').innerHTML = 
                        '<p style="color: red;">Error: ' + error.message + '</p>';
                }
            }
        </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Admin server running at http://localhost:${port}`);
  console.log(`Admin panel available at http://localhost:${port}/admin`);
});