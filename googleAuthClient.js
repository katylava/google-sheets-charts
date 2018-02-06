const google = require('googleapis');

const secrets = require('./secrets.json')

module.exports = function init() {
  const tokens = require('./tokens.json')
  const oauth2Client = new google.auth.OAuth2(
    secrets.web.client_id,
    secrets.web.client_secret,
    secrets.web.redirect_uris[0],
  )

  if (tokens.access_token) {
    oauth2Client.setCredentials(tokens)
  }

  return oauth2Client
}

