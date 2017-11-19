const g = require('./google')

const secrets = require('./secrets.json')

const plus = g.google.plus('v1')
const sheets = g.google.sheets('v4')


module.exports.getPlusProfile = new Promise(function(resolve, reject) {
  plus.people.get({ userId: 'me' }, (err, response) => {
    if (err) {
      return reject(err)
    }

    resolve(response)
  })
})

module.exports.getSheetInfo = new Promise(function(resolve, reject) {
  sheets.spreadsheets.values.get({
    spreadsheetId: secrets.sheets.sheetId,
    range: 'A1:F1'
  }, function(err, response) {
    if (err) {
      return reject(err)
    }

    resolve(response)
  })
})
