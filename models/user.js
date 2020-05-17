const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},
	password: String,
	salt: String,
	firstName: String,
	lastName: String,
	bio: String,
	birthDate: String,
	created: {
		type: Date,
		default: Date.now
	}
});

UserSchema.pre('save', function () {
	if (this.isModified('password')) {
		this.salt = crypto.randomBytes(16);

		const hash = crypto.createHash('sha256');
		hash.update(this.password + this.salt);
		this.password = hash.digest('hex');
	}
	return Promise.resolve();
});

UserSchema.methods.verifyPassword = function (password) {
	const hash = crypto.createHash('sha256');
	hash.update(password + this.salt);

	return this.password === hash.digest('hex');
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
