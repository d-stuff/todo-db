const jwt = require('jsonwebtoken');
const {tokenSecret} = require('../config')
const {getByEmail, verifyPassword} = require('../services/users-service');


module.exports = function (app) {
	app.post('/api/login', function (req, res) {
		const {email, password} = req.body || {};
		return getByEmail(email)
			.then(user => {
				if (!(user && verifyPassword(user, password))) {
					return res.status(401).json({message: 'email or password not correct'}).end();
				}
				const accessToken = jwt.sign({
					sub: user._id,
					email: user.email,
					firstName: user.firstName
				}, tokenSecret, {expiresIn: '1h'});
				const refreshToken = jwt.sign({
					sub: user._id,
					email: user.email,
				}, tokenSecret, {expiresIn: '30d'});
				return res.status(200).json({
					payload: {
						access_token: accessToken,
						refresh_token: refreshToken
					}
				}).end();
			})
			.catch(() => res.status(500).json({message: 'server error'}).end())
	});

	app.post('/api/token/refresh', function (req, res) {

	});
}
