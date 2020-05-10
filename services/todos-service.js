const mongoose = require('mongoose')
const Todo = require('../models/todo');

function getTodos() {
	return Todo.find({})
}

function addTodo(todo) {
	todo = new Todo(todo);
	return todo.save();
}

function removeTodo(todoId) {
	return Todo.findByIdAndRemove(todoId);
}

function editTodo(todoId, newData = {}) {
	return Todo.findById(todoId).then(todo => {
		Object.assign(todo, newData);
		return todo.save();
	})
}

module.exports = {
	getTodos,
	addTodo,
	removeTodo,
	editTodo
}
