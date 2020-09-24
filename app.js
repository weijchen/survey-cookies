const express         = require("express"),
      mongoose        = require("mongoose"),
      cookieSession   = require("cookie-session"),
      passport        = require("passport"),
      bodyParser      = require("body-parser"),
      
      keys            = require("./config/keys"),
      PORT            = process.env.PORT || 5000

require("./models/user");
require("./services/passport");

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to DB!"))
.catch(error => console.log(error.message));

const app             = express();

// each use() is a middleware
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,  // cookie lasts for 30 days (in millesecond)
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static('client/build'));  // check the client-side repository

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

app.listen(PORT, (req, res) => {
  console.log(`Server start at http://localhost:${PORT}`);
});
