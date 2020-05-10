const mongoose = require('mongoose');
const {mongoUri} = require('../config')

module.exports = function connect() {
	require('../models/todo');
	require('../models/user');

	return mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
		.catch(() => {
			console.log('could not connect to mongo');
			process.exit(1);
		});

}
