// =========================================================================
// PREMEXA HIGH B12 - GOOGLE SHEET AUTOMATIC ORDER ENTRY SCRIPT (ZERO BACKEND)
// =========================================================================
// 
// INSTRUCTIONS TO CONNECT YOUR GOOGLE SHEET:
// 
// 1. Open Google Sheets (https://sheets.google.com) and create a new spreadsheet named "Premexa Orders".
// 2. Go to top menu: Extensions -> Apps Script.
// 3. Delete any existing code in the editor, and paste THIS entire script below.
// 4. Click "Deploy" (top right button) -> "New deployment".
// 5. Click the gear icon next to "Select type" and choose "Web app".
// 6. Set Description: "Premexa Order Webhook"
// 7. Execute as: "Me"
// 8. Change "Who has access" to: "Anyone" (VERY IMPORTANT!).
// 9. Click "Deploy", authorize permissions, and copy the Web App URL (starts with https://script.google.com/macros/s/...).
// 10. Paste that URL into index.html in the GOOGLE_SHEET_SCRIPT_URL variable or click "⚙️ Google Sheet Setup" on the website!
// 
// That's it! Every new inquiry/order will automatically appear in your Google Sheet instantly!

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create header row if sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Mobile Number", "Full Address", "Course", "Payment Mode", "Total Amount"]);
    }
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('en-IN'),
      data.name || "",
      data.phone || "",
      data.address || "",
      data.course || "",
      data.payment || "",
      data.total || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ "status": "active", "message": "Premexa Google Sheet Webhook is active!" }))
    .setMimeType(ContentService.MimeType.JSON);
}
