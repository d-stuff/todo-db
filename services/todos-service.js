const Todo = require('../models/todo');

function getTodos(userId) {
	return Todo.find({user: userId})
}

function addTodo(todo) {
	todo = new Todo(todo);
	return todo.save();
}

function removeTodo(todoId, userId) {
	return Todo.findOneAndRemove({_id: todoId, user: userId});
}

function editTodo(todoId, userId, newData = {}) {
	return Todo.findOne({_id: todoId, user: userId}).then(todo => {
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
