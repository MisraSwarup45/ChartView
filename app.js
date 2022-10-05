//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Logos')));
app.use(express.static(path.join(__dirname, 'background')));

app.get("/", function (req, res) {
    res.render("content");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/bitcoin", function (req, res) {
    res.render("bitcoin");
});

app.get("/etherium", function (req, res) {
    res.render("etherium");
});

app.get("/tether", function (req, res) {
    res.render("tether");
});

app.get("/binance", function (req, res) {
    res.render("binance");
});

app.post("/", function (req, res) {
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server started at server 3000");
})