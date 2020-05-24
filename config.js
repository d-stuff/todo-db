module.exports = {
	mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/todos',
	port: process.env.PORT || 3000,
	tokenSecret: process.env.TOKEN_SECRET || 'my-secret-key1234',
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'my-refresh-secret-key1234',
}
