/**
 * ResQFood pickup requests -> Google Sheet (+ email alert)
 *
 * page7.html posts pickup requests here once PICKUP_ENDPOINT is set.
 * Until then the form falls back to opening a pre-filled email.
 *
 * Setup (about 5 minutes, done once by a ResQFood Google account):
 *   1. Create a Google Sheet named "ResQFood Pickup Requests".
 *   2. In the sheet: Extensions > Apps Script. Replace the editor contents
 *      with this file and save.
 *   3. Set NOTIFY_EMAIL below (or leave it empty to skip email alerts).
 *   4. Deploy > New deployment > type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *      Authorize when prompted, then copy the web app URL (ends in /exec).
 *   5. In page7.html, paste that URL into PICKUP_ENDPOINT.
 *   6. Test: submit the form once and check that a row appears.
 *
 * The URL only lets people add rows; it cannot read the sheet.
 */

const NOTIFY_EMAIL = ''; // e.g. 'veeragarwal45@gmail.com'

const HEADERS = ['Received', 'First name', 'Last name', 'Phone', 'Address',
                 'Pickup day', 'Pickup time', 'Products', 'Weight (lbs)'];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    // Leading apostrophe stops Sheets from treating user text as a formula.
    const clean = (value) => "'" + String(value == null ? '' : value).slice(0, 500);

    sheet.appendRow([
      new Date(),
      clean(data.firstName),
      clean(data.lastName),
      clean(data.phoneNumber),
      clean(data.address),
      clean(data.pickupDay),
      clean(data.pickupTime),
      clean((data.selectedProducts || []).join(', ')),
      Number(data.weight) || ''
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL,
        'New ResQFood pickup request: ' + data.firstName + ' ' + data.lastName,
        'Phone: ' + data.phoneNumber + '\n' +
        'Address: ' + data.address + '\n' +
        'Pickup: ' + data.pickupDay + ', ' + data.pickupTime + '\n' +
        'Products: ' + (data.selectedProducts || []).join(', ') + '\n' +
        'Weight: ' + data.weight + ' lbs\n\n' +
        'Sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
    }

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  }
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
