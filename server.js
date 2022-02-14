const express = require("express");
const db = require("./src/models");
db.sequelize.sync();

const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "http://localhost:8081"
};
db.sequelize.sync().then(() => {
    console.log("Drop and re-sync db.");
  });

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

  // routes
  require('./src/routes/auth.routes')(app);
  require('./src/routes/main.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 3036;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});