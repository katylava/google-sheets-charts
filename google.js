const google = require('googleapis');

const secrets = require('./secrets.json')
const tokens = require('./tokens.json')

var oauth2Client = new google.auth.OAuth2(
  secrets.web.client_id,
  secrets.web.client_secret,
  secrets.web.redirect_uris[0],
)
if (tokens.access_token) {
  oauth2Client.setCredentials(tokens)
}
google.options({ auth: oauth2Client })

module.exports = {
  google: google,
  auth: oauth2Client
}
