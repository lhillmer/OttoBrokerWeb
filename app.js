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

// Route '/'
app.get('/', function (req, res) {
    request('http://otto.runtimeexception.net/broker/all_users?shallow=true', function (error, response, body) {
        var obj = JSON.parse(body)
        res.render('index', {
            users: obj.user_list
        })
    })
});

// Route '/user'
app.get('/user/:userId', function (req, res) {
    request('http://otto.runtimeexception.net/broker/user_info?userid=' + req.params.userId, function (error, response, body) {
        var obj = JSON.parse(body)
        if (obj.status == 'success') {
            var holding_list = []
            var holdings = obj.user.holdings
            Object.keys(holdings).forEach(function (key) {
                holding_list.push({
                    symbol: key,
                    name: holdings[key].name,
                    quantity: holdings[key].stock_count,
                    total: holdings[key].total_value
                })
            })
            var short_list = []
            var shorts = obj.user.shorts
            Object.keys(shorts).forEach(function (key) {
                short_list.push({
                    symbol: key,
                    name: shorts[key].name,
                    quantity: shorts[key].stock_count,
                    total: shorts[key].total_value
                })
            })
            res.render('user', {
                user: obj.user,
                holdings: holding_list,
                shorts: short_list
            })
        } else {
            res.redirect('/')
        }
    })
});

app.listen(3000, () => console.log('Listening on port 3000!'))