const google = require('googleapis')
const googleClient = require('./googleAuthClient')()

const secrets = require('./secrets.json')


google.options({ auth: googleClient })
const plus = google.plus('v1')
const sheets = google.sheets('v4')


module.exports.getPlusProfile = function() {
  return new Promise(function(resolve, reject) {
    plus.people.get({ userId: 'me' }, (err, response) => {
      if (err) {
        return reject(err)
      }

      resolve(response.data)
    })
  })
}


module.exports.getSheetInfo = function() {
  return new Promise(function(resolve, reject) {
    sheets.spreadsheets.values.get({
      spreadsheetId: secrets.sheets.sheetId,
      range: 'A1:F1'
    }, function(err, response) {
      if (err) {
        return reject(err)
      }

      resolve(response.data)
    })
  })
}
