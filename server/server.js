
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var port = process.env.PORT || 3000;
var data = {"id":1,"label":"a","children":[{"id":2,"label":"B","children":[{"id":5,"label":"E"},{"id":6,"label":"F"},{"id":7,"label":"G"}]},{"id":3,"label":"C"},{"id":4,"label":"D","children":[{"id":8,"label":"H"},{"id":9,"label":"I"}]}]};

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.route('/getJSON')
.get(function(req, res) {
    res.json(data);
});



app.listen(port);

console.log('Server listen at: ' + port);