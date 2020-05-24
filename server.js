const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {port} = require('./config');
const connect = require('./db');
const app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));

require('./routes')(app);

connect().then(() => {
	console.log('DB is connected')
	app.listen(port, () => {
		console.log('Server is up with express on port: ', port)
	})
})

