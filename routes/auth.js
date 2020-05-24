const jwt = require('jsonwebtoken');
const {tokenSecret, refreshTokenSecret} = require('../config')
const {getByEmail, verifyPassword} = require('../services/users-service');

function getTokens(user) {
	const created = new Date().toJSON();
	const accessToken = jwt.sign({
		sub: user._id,
		email: user.email,
		firstName: user.firstName
	}, tokenSecret, {expiresIn: '1h'});

	const refreshToken = jwt.sign({
		sub: user._id,
		email: user.email,
		created
	}, refreshTokenSecret, {expiresIn: '30d'});

	user.refreshTokenIdentifier = created;
	user.save();

	return {
		access_token: accessToken,
		refresh_token: refreshToken
	};
}

module.exports = function (app) {
	app.post('/api/login', function (req, res) {
		const {email, password} = req.body || {};
		return getByEmail(email)
			.then(user => {
				if (!(user && verifyPassword(user, password))) {
					return res.status(401).json({message: 'email or password not correct'}).end();
				}
				return res.status(200).json({
					payload: getTokens(user)
				}).end();
			})
			.catch(() => res.status(500).json({message: 'server error'}).end())
	});

	app.post('/api/token/refresh', async function (req, res) {
		if (req.headers.authorization) {
			// Bearer s8d7fgsduyifgbyudsgdsufydsf
			const token = req.headers.authorization.split(' ')[1];

			try {
				const {email, created} = await jwt.verify(token, refreshTokenSecret);
				const user = await getByEmail(email);

				if (created === user.refreshTokenIdentifier) {
					return res.status(200).json({
						payload: getTokens(user)
					}).end();
				}
			} catch (e) {
				return res.status(401).json({message: 'server error'}).end();
			}
		}
		return res.status(401).json({message: 'server error'}).end();
	});
}
