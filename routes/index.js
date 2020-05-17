module.exports = function (app) {
	require('./todos')(app);
	require('./auth')(app);
}
