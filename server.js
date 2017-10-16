/*

This file is simply used to serve the express app

*/

var app = require('./app')

//listen
app.listen(process.env.PORT || 5000);