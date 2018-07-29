var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var request = require('request')

var app = express()

// View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')))

function ParseUserStocks(object) {
    var stockList = []
    var stocks = object.user.stocks
    for (i in stocks) {
        var symbol = ''
        var quantity = 0
        var transactions = stocks[i]
        for (j in transactions) {
            symbol = transactions[j].symbol
            quantity += parseInt(transactions[j].count)
        }
        stockList.push({symbol: symbol, quantity: quantity})
    }
    return stockList
}

// Route '/'
app.get('/', function(req, res) {
    request('http://otto.runtimeexception.net/broker/all_users?shallow=true', function (error, response, body) {
        var obj = JSON.parse(body)
        res.render('index', {
            users: obj.user_list
        })
    })
});

// Route '/user'
app.get('/user/:userId', function(req, res) {
    request('http://otto.runtimeexception.net/broker/user_info?userid='+req.params.userId, function (error, response, body) {
        var obj = JSON.parse(body)
        if (obj.status == 'success') {
            var stockList = ParseUserStocks(obj)
            res.render('user', {
                user: obj.user,
                stocks: stockList
            })
        } else {
            res.redirect('/')
        }
    })
});

app.listen(3000, () => console.log('Listening on port 3000!'))