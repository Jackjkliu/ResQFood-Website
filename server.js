import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import express from 'express';
import bodyParser from 'body-parser';
import TeleSignSDK from 'telesignsdk';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3003;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPUD1sfg-ujtI0B3sYY4UEYSn-PR0_Ha4",
  authDomain: "resqfood-27b66.firebaseapp.com",
  projectId: "resqfood-27b66",
  storageBucket: "resqfood-27b66.appspot.com",
  messagingSenderId: "14549140894",
  appId: "1:14549140894:web:2f3e3087f0e8ee7122c28f",
  measurementId: "G-5R1EX99K6J"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Other routes
const pages = ['page2', 'page3', 'page4', 'page5', 'page6', 'page7'];
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, `${page}.html`));
  });
});

// Handle signup
app.post('/signup', async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Here you might want to store additional user info (firstname, lastname) in your database
    res.status(200).json({ message: "Signup Successful", user: userCredential.user });
  } catch (error) {
    res.status(400).json({ message: "Signup Failed", error: error.message });
  }
});

// Handle signin
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    res.status(200).json({ message: "Signin Successful", user: userCredential.user });
  } catch (error) {
    res.status(400).json({ message: "Signin Failed", error: error.message });
  }
});

app.post('/send-sms', async (req, res) => {
  const adminPhoneNumber = "+12016872707";  // Always send to this number
  const selectedProducts = req.body.selectedProducts || [];

  // Construct the message with selected products
  const message = `
  New donation from ${req.body.firstName} ${req.body.lastName}. 
  Phone: ${req.body.phoneNumber}
  Address: ${req.body.address}
  Product Type(s): ${selectedProducts.join(', ')}
  Weight: ${req.body.weight} lbs
  Pickup Window: ${req.body.pickupDay}, ${req.body.pickupTime}
  `.trim();

  console.log("Received message:", message);
  console.log("Selected products:", selectedProducts);

  const customerId = process.env.CUSTOMER_ID || "A8289DFD-EC30-453C-A8F9-487A7B898B6A";
  const apiKey = process.env.API_KEY || "n/nmsjXXnyO7XDr+IEvs1CqSjujditwQF7BS5VX7Lm1WtCw4eC6ovZWE3/rxrvwbc7FpP5H5Uq9s1IsyIAcYlA==";
  const messageType = "ARN";

  const client = new TeleSignSDK(customerId, apiKey);

  try {
    // Send SMS only to admin number
    await sendSMS(client, adminPhoneNumber, message, messageType);

    res.json({ success: true, message: "SMS sent successfully" });
  } catch (error) {
    console.error("Unable to send SMS. Error:", error);
    res.status(500).json({ success: false, message: "Failed to send SMS" });
  }
});

function sendSMS(client, phoneNumber, message, messageType) {
  return new Promise((resolve, reject) => {
    client.sms.message((error, responseBody) => {
      if (error === null) {
        console.log("\nResponse body:\n" + JSON.stringify(responseBody, null, 2));
        resolve(responseBody);
      } else {
        console.error("Unable to send SMS. Error:\n\n" + JSON.stringify(error, null, 2));
        reject(error);
      }
    }, phoneNumber, message, messageType);
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});