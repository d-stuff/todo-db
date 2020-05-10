const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({}, {strict: false});
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;
