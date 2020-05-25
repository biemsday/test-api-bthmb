const express = require('express')
const app = express()

app.set('port', 3000);

//entry point
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/client.html')
})

//additional
app.use('/', function(req, res) {
    res.sendFile(__dirname + '/client/client.js')
})

app.listen(3000)

console.log("Server started.")