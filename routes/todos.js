const jwt = require('jsonwebtoken');
const {tokenSecret} = require('../config');
const {getTodos, addTodo, removeTodo, editTodo} = require('../services/todos-service')

function verifyUser(req, res, next) {
	if(req.headers.authorization) {
		// Bearer s8d7fgsduyifgbyudsgdsufydsf
		const token = req.headers.authorization.split(' ')[1]

		return jwt.verify(token, tokenSecret)
			.then((decoded) => {
				req.user = decoded;
				next();
			})
			.catch(() => {
				return res.status(401).json({message: 'you are not authorized'}).end();
			});
	}
}

module.exports = function (app) {
	app.get('/api/todos', verifyUser, function (req, res) {
		getTodos(req.user.sub)
			.then(todos => {
				res
					.status(200)
					.json(todos)
					.end();
			})
			.catch(() => {
				res.status(500)
					.json({message: 'internal error while loading todos list'})
					.end();
			});
	});

	app.post('/api/todos', verifyUser, function (req, res) {
		if (!req.body || !req.body.content) {
			return res.status(400).json({message: 'content is missing'}).end();
		}

		const todo = {
			...req.body,
			user: req.user.sub
		}

		addTodo(todo)
			.then(function (newTodo) {
				res.status(200).json(newTodo).end();
			})
			.catch(() => {
				res.status(500).json({message: 'internal error while trying to save todo'}).end();
			})
	});

	app.delete('/api/todos/:todoId', verifyUser, function (req, res) {
		removeTodo(req.params.todoId, req.user.sub)
			.then(() => {
				res.status(200).json({success: true}).end();
			})
			.catch(() => {
				res.status(500).json({message: 'internal error while trying to save todo'}).end();
			});
	});

	app.put('/api/todos/:todoId', verifyUser, function (req, res) {
		editTodo(req.params.todoId, req.user.sub, req.body)
			.then(function (todo) {
				res.status(200).json(todo).end();
			})
			.catch(() => {
				res.status(500).json({message: 'internal error while trying to update todo'}).end();
			})
	});
}
