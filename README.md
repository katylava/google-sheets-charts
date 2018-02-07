**Initial WIP -- doesn't do anything yet except auth with google**

App to run locally to make charts out of google sheets data, because google
sheets charts suck.


## Setup

1. Create a new project in [Google's developer
   console](https://console.developers.google.com) and set up oauth
   credentials. Download the credentials json file.
2. `cp secrets.example.json secrets.json` and copy the credentials you
   downloaded into it. Note that there are other secrets in this file so don't
   just overwrite it.
3. Create your master sheet in google drive and add its id to secrets.json.
3. Create an initial empty tokens.json file: `echo '{}' > tokens.json`.
4. `node app.js`
5. Visit http://localhost:5000 and authorize with google.
6. ... still working on the rest ... for now put some data in cells A1:F1 of
   your master sheet and you should see the output at http://localhost:5000.


## Notes

- Going to be using [C3.js](http://c3js.org/gettingstarted.html).
- All chart options will be read from the main sheet, which might point to
    other sheets.
