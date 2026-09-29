function doPost(e) {
  // Use the exact ID of your new spreadsheet
  var sheetApp = SpreadsheetApp.openById('1RABC5yXjk_3mGdUqyKauqFx5LS03fJ9_UanZiLBXJjo');
  
  // Robust parameter parsing
  var params = e.parameter;
  
  // Fallback parsing for raw post data if e.parameter is empty
  if (Object.keys(params).length === 0 && e.postData && e.postData.contents) {
    try {
      var rawData = e.postData.contents;
      var pairs = rawData.split('&');
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        if (pair.length === 2) {
          params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
        }
      }
    } catch (err) {
      // Ignore fallback parsing errors
    }
  }
  
  // Our forms either send 'type' (RSVP/Wishes) or 'sheet' (BlessingForm)
  var type = params.type || params.sheet; 
  
  if (!type) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'No type specified' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Convert type to lowercase to make it match exactly
  var requestType = type.toLowerCase();
  
  if (requestType === 'rsvp') {
    return handleRSVP(sheetApp, params);
  } else if (requestType === 'wish') {
    return handleWish(sheetApp, params);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Unknown type' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleRSVP(sheetApp, params) {
  var sheetName = "RSVP";
  var sheet = sheetApp.getSheetByName(sheetName);
  
  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = sheetApp.insertSheet(sheetName);
    sheet.appendRow(["Timestamp", "Full Name", "Number of Guests", "Attendance"]);
    sheet.getRange(1, 1, 1, 4).setFontWeight("bold"); // Make headers bold
    sheet.setFrozenRows(1); // Freeze the header row
  }
  
  var timestamp = new Date();
  var fullName = params.fullName || "";
  var guests = params.guests || "";
  var attendance = params.attendance || "";
  
  sheet.appendRow([timestamp, fullName, guests, attendance]);
  
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleWish(sheetApp, params) {
  var sheetName = "Wishes";
  var sheet = sheetApp.getSheetByName(sheetName);
  
  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = sheetApp.insertSheet(sheetName);
    sheet.appendRow(["Timestamp", "Name", "Message"]);
    sheet.getRange(1, 1, 1, 3).setFontWeight("bold"); // Make headers bold
    sheet.setFrozenRows(1); // Freeze the header row
  }
  
  var timestamp = new Date();
  var name = params.name || "";
  var message = params.message || "";
  
  sheet.appendRow([timestamp, name, message]);
  
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
