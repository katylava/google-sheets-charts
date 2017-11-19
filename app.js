#!/usr/bin/env node
const fs = require('fs')

const express = require('express')
const nunjucks = require('nunjucks')

const g = require('./google')
const data = require('./data')


const app = express()


nunjucks.configure('templates', {
  autoescape: true,
  express: app
})


var tokens = require('./tokens.json')


app.get('/', function(req, res) {
  if (!tokens.access_token) {
    console.log('No access token, redirecting to /auth')
    return res.redirect('/auth')
  }

  Promise.all([
    data.getPlusProfile,
    data.getSheetInfo
  ]).then(result => {
    res.render('index.html', { plus: result[0], sheetInfo: result[1] })
  }).catch(err => {
    console.error(err)
  })
})


app.get('/auth', function(req, res) {
  if (tokens.access_token) {
    console.log('Tokens exist, not re-authorizing')
    g.auth.setCredentials(tokens)
    return res.redirect('/')
  }

  let url = g.auth.generateAuthUrl({
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

  g.auth.getToken(req.query.code, function(err, _tokens) {
    if (err) {
      console.log(err)
      return res.redirect('/auth')
    }

    tokens = _tokens
    g.auth.setCredentials(tokens)

    fs.writeFile('./tokens.json', JSON.stringify(tokens, null, 2), (err) => {
      if (err) {
        console.log(err)
      }

      res.redirect('/')
    })
  })
})


app.listen(5000, () => console.log('http://localhost:5000'))
