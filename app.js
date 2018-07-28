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
app.get('/', function(req, res) {
    request('http://otto.runtimeexception.net/broker/all_users?shallow=true', function (error, response, body) {
        var obj = JSON.parse(body)
        res.render('index', {
            users: obj.user_list
        })
    })
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))