// Code.gs for Google Sheets
function setCorsHeaders(output) {
  if (!output) {
    output = ContentService.createTextOutput('');
  }

  output.setMimeType(ContentService.MimeType.JSON);

  // Add specific origin instead of wildcard
  output.addHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.addHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  output.addHeader('Access-Control-Allow-Credentials', 'true');

  return output;
}

function getJsonOutput(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  return setCorsHeaders(output);
}

function doGet(e) {
  const action = e.parameter.action;
  let output;

  switch(action) {
    case 'getLeaderboard':
      output = getLeaderboard();
      break;
    case 'getGameState':
      output = getGameState();
      break;
    default:
      output = getJsonOutput({
        success: false,
        error: 'Invalid action'
      });
  }

  return setCorsHeaders(output);
}

function doPost(e) {
  const action = e.parameter.action;
  const data = JSON.parse(e.postData.contents);
  let output;

  switch(action) {
    case 'saveScore':
      output = saveScore(data);
      break;
    case 'resetLeaderboard':
      output = resetLeaderboard();
      break;
    case 'updateGameState':
      output = updateGameState(data);
      break;
    default:
      output = getJsonOutput({
        success: false,
        error: 'Invalid action'
      });
  }

  return setCorsHeaders(output);
}

function doOptions(e) {
  return setCorsHeaders(ContentService.createTextOutput(''));
}

function getLeaderboard() {
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('leaderboard');

    // Create and initialize leaderboard sheet if it doesn't exist
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('leaderboard');
      sheet.getRange('A1:D1').setValues([['level', 'score', 'playerName', 'timestamp']]);
    }

    const data = sheet.getDataRange().getValues();
    const [headers, ...rows] = data;

    const leaderboard = rows.map(row => {
      return {
        level: Number(row[0]),
        score: Number(row[1]),
        playerName: String(row[2]),
        timestamp: row[3] ? new Date(row[3]).toISOString() : new Date().toISOString()
      };
    });

    return getJsonOutput({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    return getJsonOutput({
      success: false,
      error: error.toString(),
      data: [] // Return empty leaderboard on error
    });
  }
}

function saveScore(data) {
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('leaderboard');

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('leaderboard');
      sheet.getRange('A1:D1').setValues([['level', 'score', 'playerName', 'timestamp']]);
    }

    const row = [
      Number(data.level),
      Number(data.score),
      String(data.playerName),
      new Date()
    ];
    sheet.appendRow(row);

    return getJsonOutput({
      success: true
    });
  } catch (error) {
    return getJsonOutput({
      success: false,
      error: error.toString()
    });
  }
}

function resetLeaderboard() {
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('leaderboard');

    // If sheet doesn't exist, create it with headers only
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('leaderboard');
      sheet.getRange('A1:D1').setValues([['level', 'score', 'playerName', 'timestamp']]);
      return getJsonOutput({
        success: true
      });
    }

    // Get header row before clearing
    const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();

    // Clear sheet and restore headers
    sheet.clear();
    sheet.getRange(1, 1, 1, headerRow[0].length).setValues(headerRow);

    return getJsonOutput({
      success: true
    });
  } catch (error) {
    return getJsonOutput({
      success: false,
      error: error.toString()
    });
  }
}

function getGameState() {
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('gameState');

    // Create and initialize gameState sheet if it doesn't exist
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('gameState');
      sheet.getRange('A1:B1').setValues([['key', 'value']]);
      // Initialize with default unlocked level
      sheet.getRange('A2:B2').setValues([['unlockedLevels', '[2]']]);
    }

    const data = sheet.getDataRange().getValues();
    const [headers, ...rows] = data;

    // Ensure we have at least the default unlocked level
    if (rows.length === 0) {
      sheet.getRange('A2:B2').setValues([['unlockedLevels', '[2]']]);
      rows.push(['unlockedLevels', '[2]']);
    }

    const gameState = {};
    rows.forEach(row => {
      try {
        // Handle JSON strings (like arrays)
        if (typeof row[1] === 'string' && (row[1].startsWith('[') || row[1].startsWith('{'))) {
          gameState[row[0]] = JSON.parse(row[1]);
        } else {
          gameState[row[0]] = row[1];
        }
      } catch (e) {
        gameState[row[0]] = row[1];
      }
    });

    // Ensure unlockedLevels exists and is an array
    if (!gameState.unlockedLevels || !Array.isArray(gameState.unlockedLevels)) {
      gameState.unlockedLevels = [2];
    }

    return getJsonOutput({
      success: true,
      data: gameState
    });
  } catch (error) {
    return getJsonOutput({
      success: false,
      error: error.toString(),
      data: { unlockedLevels: [2] } // Return default state on error
    });
  }
}

function updateGameState(inputData) {
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('gameState');

    // Create and initialize gameState sheet if it doesn't exist
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('gameState');
      sheet.getRange('A1:B1').setValues([['key', 'value']]);
      // Initialize with default unlocked level
      sheet.getRange('A2:B2').setValues([['unlockedLevels', '[2]']]);
    }

    const key = inputData.key;
    let value = inputData.value;

    // If value is an array or object, stringify it
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    const sheetData = sheet.getDataRange().getValues();
    const [headers, ...rows] = sheetData;
    const keyIndex = rows.findIndex(row => row[0] === key);

    if (keyIndex === -1) {
      sheet.appendRow([key, value]);
    } else {
      sheet.getRange(keyIndex + 2, 2).setValue(value);
    }

    return getJsonOutput({
      success: true
    });
  } catch (error) {
    return getJsonOutput({
      success: false,
      error: error.toString()
    });
  }
}
