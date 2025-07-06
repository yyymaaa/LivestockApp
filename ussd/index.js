const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const ussdHandler = require("./ussdMenu");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ USSD callback route
app.post("/ussd", ussdHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ USSD server running on port ${PORT}`);
});
