// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();
// Set the bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
// Use CSS and Media
app.use(express.static("public"));
// Override to REST Methods
app.use(methodOverride(req => req.body._method));

//Routes for the app
const routes = require("./routes");
app.use("/", routes);

app.listen(5001, console.log("Express Server - http://localhost:5001"));
