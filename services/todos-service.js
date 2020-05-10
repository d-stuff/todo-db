const mongoose = require('mongoose')
const Todo = require('../models/todo');

function getTodos() {
	return Todo.collection.find({}).toArray()
}

function addTodo(todo) {
	return Todo.collection.insertOne(todo)
		.then(({insertedId}) => {
			return Todo.collection.findOne({_id: insertedId})
		});
}

function removeTodo(todoId) {
	return Todo.collection.deleteOne({_id: mongoose.Types.ObjectId(todoId)});
}

function editTodo(todoId, todo = {}) {
	const {content, isDone = false} = todo;
	return Todo.collection.updateOne({_id: mongoose.Types.ObjectId(todoId)}, {$set: {content, isDone}})
		.then(() => Todo.collection.findOne({_id: mongoose.Types.ObjectId(todoId)}))
}

module.exports = {
	getTodos,
	addTodo,
	removeTodo,
	editTodo
}
