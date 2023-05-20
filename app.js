//jshint esversion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const https = require("https");
const mongoose = require("mongoose");
// const md5 = require("md5");
const encrypt = require("mongoose-encryption");
const { urlencoded } = require("body-parser");
const { log } = require("console");
const { resolveSoa } = require('dns');
const axios = require('axios');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Logos')));
app.use(express.static(path.join(__dirname, 'background')));

mongoose.connect(`mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@cluster0.5nu8yr2.mongodb.net/userDB`, { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const secret = process.env.SECRET;

// console.log(process.env.SECRET);

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

let logName = false;
let username = "";

app.get("/", (req, res) => {
    // console.log(process.env.SECRET);
    res.render("content", { label: logName ? username : "Get Started" });
});

app.get("/contact", (req, res) => {
    res.render("contact", { label: logName ? username : "Get Started" });
});

app.get("/navbar", (req, res) => {
    res.render("navbar", { label: logName ? username : "Get Started" });
});

app.get("/about", (req, res) => {
    res.render("about", { label: logName ? username : "Get Started" });
});

app.get("/signup", (req, res) => {
    res.render("signup", { label: logName ? username : "Get Started", headName: logName });
});

app.get("/login", (req, res) => {
    res.render("login", { label: logName ? username : "Get Started", headName: logName });
});

app.get("/bitcoin", (req, res) => {
    res.render("bitcoin", { label: logName ? username : "Get Started" });
});

app.get("/etherium", (req, res) => {
    res.render("etherium", { label: logName ? username : "Get Started" });
});

app.get("/tether", (req, res) => {
    res.render("tether", { label: logName ? username : "Get Started" });
});

app.get("/binance", (req, res) => {
    res.render("binance", { label: logName ? username : "Get Started" });
});

app.get("/errorpage", (req, res) => {
    res.render("errorpage", { label: logName ? username : "Get Started" });
});



app.get("/chart", async (req, res) => {
    try {
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en");
        const coinData = response.data;
        res.render("chart", { label: logName ? username : "Get Started", gotCoin: coinData });
    } catch (error) {
        console.error("Error retrieving data from API:", error);
        res.render("errorpage");
    }
});

app.post("/signup", async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        await promisify(newUser.save.bind(newUser))();
        logName = true;
        username = req.body.name;
        res.render("content", { label: logName ? username : "Get Started" });
    } catch (error) {
        console.log(error);
        res.render("errorpage");
    }
});

app.post("/login", async (req, res) => {
    const username = req.body.email;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({ email: username });
        if (foundUser && foundUser.password === password) {
            logName = true;
            username = req.body.email;
            res.render("content", { label: logName ? username : "Get Started", headName: logName });
        } else {
            res.render("errorpage");
        }
    } catch (error) {
        console.log(error);
        res.render("errorpage");
    }
});

app.post("/", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 4000, function () {
    console.log("Server started at server 4000");
});