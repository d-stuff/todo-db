const User = require('../models/user');

function getByEmail(email) {
	return User.findOne({email});
}

function verifyPassword(user, password) {
	return user.verifyPassword(password);
}

module.exports = {
	getByEmail,
	verifyPassword
}
