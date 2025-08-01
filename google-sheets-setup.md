# Google Sheets Integration Setup Guide

## Overview
Your donation tracker now supports live synchronization with Google Sheets! This means all donations will be automatically saved to your Google Sheet and displayed live on your website.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "ResQFood Donations"
4. Set up the following column headers in row 1:
   - A1: Date
   - B1: Restaurant
   - C1: Volunteer(s)
   - D1: Contents
   - E1: Estimated Dollar Value

## Step 2: Get Your Google Sheet ID

1. Look at your Google Sheet URL. It will look like:
   `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
2. Copy the long string between `/d/` and `/edit` - this is your Sheet ID
3. In this example, the Sheet ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 3: Get a Google API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"
4. Create an API key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

## Step 4: Make Your Google Sheet Public (Read-Only)

1. In your Google Sheet, click the "Share" button
2. Click "Change to anyone with the link"
3. Set permission to "Viewer" (this allows the website to read the data)
4. Click "Done"

## Step 5: Update Your Website Configuration

1. Open your `donations.html` file
2. Find this section near the top of the JavaScript:

```javascript
const GOOGLE_SHEETS_CONFIG = {
    API_KEY: 'YOUR_API_KEY_HERE', // Replace with your Google API key
    SHEET_ID: 'YOUR_SHEET_ID_HERE', // Replace with your Google Sheet ID
    RANGE: 'Sheet1!A:E' // Adjust range as needed
};
```

3. Replace:
   - `YOUR_API_KEY_HERE` with your actual API key
   - `YOUR_SHEET_ID_HERE` with your actual Sheet ID

## Step 6: Test the Integration

1. Open your donations.html page
2. Log in with your admin credentials
3. You should see a status message indicating whether Google Sheets is connected
4. Try adding a new donation - it should appear both on your website and in your Google Sheet

## Features

### Automatic Sync
- New donations are automatically added to your Google Sheet
- The website displays live data from your Google Sheet
- If Google Sheets is unavailable, data is saved locally as a backup

### Status Messages
- Green: Successfully connected to Google Sheets
- Yellow: Using local storage (Google Sheets not connected)
- Red: Error occurred

### Fallback System
- If Google Sheets API is not configured or fails, the system automatically falls back to local storage
- Your data is never lost!

## Troubleshooting

### "Google Sheets not connected" message
- Check that your API key and Sheet ID are correct
- Ensure your Google Sheet is shared publicly (viewer access)
- Make sure the Google Sheets API is enabled in your Google Cloud project

### Data not appearing
- Check that your sheet has the correct column headers
- Verify the RANGE setting matches your sheet structure
- Check the browser console for error messages

### API Key Security
- Your API key is visible in the client-side code
- Consider restricting your API key to specific domains in the Google Cloud Console
- For production use, consider implementing server-side authentication

## Column Structure

Your Google Sheet should have these columns:
- **Column A (Date)**: Date of the donation
- **Column B (Restaurant)**: Name of the restaurant/donor
- **Column C (Volunteer(s))**: Names of volunteers who handled the pickup
- **Column D (Contents)**: Description of food items donated
- **Column E (Estimated Dollar Value)**: Monetary value of the donation

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all configuration values are correct
3. Test with a simple donation entry
4. Ensure your Google Sheet is accessible via the sharing link

The system is designed to work even if Google Sheets is not configured - it will simply use local storage as a backup!