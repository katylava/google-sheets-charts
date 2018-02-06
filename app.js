#!/usr/bin/env node
const fs = require('fs')

const express = require('express')
const nunjucks = require('nunjucks')

const googleClient = require('./googleAuthClient')()
const data = require('./data')


const app = express()


nunjucks.configure('templates', {
  autoescape: true,
  express: app
})


var tokens = require('./tokens.json')


function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error.html', { error: err })
}


app.get('/', async function(req, res, next) {
  if (!tokens.access_token) {
    console.log('No access token, redirecting to /auth')
    return res.redirect('/auth')
  }

  try {
    var [ plus, sheetInfo ] = await Promise.all([
      data.getPlusProfile(),
      data.getSheetInfo(),
    ])
  } catch(e) {
    return next(e)
  }

  res.render('index.html', { plus, sheetInfo })
})


app.get('/auth', function(req, res) {
  if (tokens.access_token) {
    console.log('Tokens exist, not re-authorizing')
    if (!googleClient.credentials) {
      googleClient.setCredentials(tokens)
    }
    return res.redirect('/')
  }

  let url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/plus.me',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
    ]
  })

  res.render('auth.html', { url })
})


app.get('/oath2callback', function(req, res) {
  if (!req.query.code) {
    console.log('No callback code, redirecting to /auth')
    return res.redirect('/auth')
  }

  googleClient.getToken(req.query.code, function(err, _tokens) {
    if (err) {
      console.log(err)
      return next(err)
    }

    tokens = _tokens
    googleClient.setCredentials(tokens)

    fs.writeFile('./tokens.json', JSON.stringify(tokens, null, 2), (err) => {
      if (err) {
        console.log(err)
        return next(err)
      }

      res.redirect('/')
    })
  })
})

app.use(errorHandler)

app.listen(5000, () => console.log('http://localhost:5000'))
