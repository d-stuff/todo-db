const express = require('express');
const bodyParser = require('body-parser');
const {port} = require('./config');
const {getTodos, addTodo, removeTodo, editTodo} = require('./services/todos-service')
const connect = require('./db');
const app = express();

app.use(bodyParser.json());

app.get('/api/todos', function (req, res) {
	getTodos()
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

app.post('/api/todos', function (req, res) {
	if (!req.body || !req.body.content) {
		return res.status(400).json({message: 'content is missing'}).end();
	}

	addTodo(req.body)
		.then(function (newTodo) {
			res.status(200).json(newTodo).end();
		})
		.catch(() => {
			res.status(500).json({message: 'internal error while trying to save todo'}).end();
		})
});

app.delete('/api/todos/:todoId', function (req, res) {
	removeTodo(req.params.todoId)
		.then(() => {
			res.status(200).json({success: true}).end();
		})
		.catch(() => {
			res.status(500).json({message: 'internal error while trying to save todo'}).end();
		});
});

app.put('/api/todos/:todoId', function (req, res) {
	editTodo(req.params.todoId, req.body)
		.then(function (todo) {
			res.status(200).json(todo).end();
		})
		.catch(() => {
			res.status(500).json({message: 'internal error while trying to update todo'}).end();
		})
});

connect().then(() => {
	console.log('DB is connected')
	app.listen(port, () => {
		console.log('Server is up with express on port: ', port)
	})
})

