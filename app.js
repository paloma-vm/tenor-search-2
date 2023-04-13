// Require Libraries
const express = require('express');

// App Setup
const app = express();
// Somewhere near the top
app.use(express.static('public'));

// Middleware

// Allow Express (our web framework) to render HTML templates and send them back to the client using a new function
const handlebars = require('express-handlebars');

const hbs = handlebars.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo() { return 'FOO!'; },
        bar() { return 'BAR!'; }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Require tenorjs near the top of the file
const Tenor = require("tenorjs").client({
  // Replace with your own key
  "Key": "AIzaSyC-2OG3waKRD77LS588MaWloweKFpe27Pg", // https://tenor.com/developer/keyregistration
  "Filter": "high", // "off", "low", "medium", "high", not case sensitive
  "Locale": "en_US", // Your locale here, case-sensitivity depends on input
});

// Routes

app.get('/', (req, res) => {
  // Handle the home page when we haven't queried yet
  term = ""
  if (req.query.term) {
      term = req.query.term
  }
  // Tenor.search.Query("SEARCH KEYWORD HERE", "LIMIT HERE")
  Tenor.Search.Query(term, "10")
      .then(response => {
          // store the gifs we get back from the search
          const gifs = response;
          // pass the gifs as an object into the home page
          res.render('home', { gifs })
      }).catch(console.error);
})

app.get('/', (req, res) => {
  console.log(req.query)
  res.render('home')
})

// app.get('/', (req, res) => {
//     res.send('Hello Squirrel');
//   });

// app.get('/', (req, res) => {
//   // set the url of the gif
//   const gifUrl = 'https://media1.tenor.com/images/561c988433b8d71d378c9ccb4b719b6c/tenor.gif?itemid=10058245'
//   // render the hello-gif view, passing the gifUrl into the view to be displayed
//   res.render('hello-gif', { gifUrl })
// })

app.get('/greetings/:name', (req, res) => {
  // grab the name from the path provided
  const name = req.params.name;
  // render the greetings view, passing along the name
  res.render('greetings', { name });
})

// Start Server

app.listen(3000, () => {
  console.log('Gif Search listening on port localhost:3000!');
});