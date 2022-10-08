//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const https = require("https");


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

app.get("/chart", function(req, res){


    https.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=5&page=1&sparkline=false", function(response){
        const coinArray = [];
        response.on("data", function(data){
            coinArray.push(data);
        });
        console.log(coinArray);
        response.on("end", function(){
            const data = Buffer.concat(coinArray);
            let got = JSON.parse(data);
            console.log(got.length);
            // for(let i = 0; i<got.length;i++){
            res.render("chart", {size : got.length, Value1 : got[0].image, Value2 : got[0].name, Value3 : got[0].symbol, Value4 : got[0].current_price, Value5 : got[0].high_24h, Value6 : got[0].price_change_percentage_24h, Value7 : got[0].market_cap} );
            // }
        });
    });

    
});

app.post("/", function (req, res) {
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server started at server 3000");
})