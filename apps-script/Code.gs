/**
 * Faria Dashboard — Google Sheet Web App bridge
 * ------------------------------------------------
 * Deploy this from the SAME spreadsheet that Google Workspace Studio writes into.
 * It turns the sheet into a tiny JSON API the dashboard can read and write.
 *
 *   GET  <web-app-url>            → { ok: true, rows: [{ _row, Category, Summary, ... }] }
 *   POST <web-app-url>  body:{row, status} → sets the Status cell on that row
 *
 * Setup: Extensions ▸ Apps Script ▸ paste this ▸ Deploy ▸ New deployment ▸
 *        type "Web app" ▸ Execute as "Me" ▸ Who has access "Anyone" ▸ Deploy.
 *        Copy the /exec URL into the dashboard's VITE_SHEET_API_URL env var.
 */

// Leave blank to use the first sheet/tab, or set to your tab name e.g. "Sheet1".
var SHEET_NAME = '';

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return (SHEET_NAME && ss.getSheetByName(SHEET_NAME)) || ss.getSheets()[0];
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Read all rows as objects keyed by the header row. */
function doGet() {
  try {
    var sheet = getSheet_();
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return json_({ ok: true, rows: [] });

    var headers = values.shift().map(function (h) { return String(h).trim(); });
    var rows = [];
    for (var i = 0; i < values.length; i++) {
      var raw = values[i];
      // Skip fully-empty rows.
      var hasData = raw.some(function (c) { return String(c).trim() !== ''; });
      if (!hasData) continue;

      var obj = { _row: i + 2 }; // +2: 1 for header, 1 for 1-based rows
      for (var c = 0; c < headers.length; c++) {
        if (headers[c]) obj[headers[c]] = raw[c];
      }
      rows.push(obj);
    }
    return json_({ ok: true, rows: rows });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Update the Status cell for one row. Body: { "row": 5, "status": "Done" }. */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var row = Number(body.row);
    var status = String(body.status || '');
    if (!row || row < 2) return json_({ ok: false, error: 'Invalid row' });

    var sheet = getSheet_();
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      .map(function (h) { return String(h).trim(); });

    var statusCol = headers.indexOf('Status');
    if (statusCol === -1) {
      // Create a Status column at the end if the sheet doesn't have one yet.
      statusCol = headers.length;
      sheet.getRange(1, statusCol + 1).setValue('Status');
    }
    sheet.getRange(row, statusCol + 1).setValue(status);
    return json_({ ok: true, row: row, status: status });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
