const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
	patterns: {
		type: [String],
		required: [true, "A message must have at least a `pattern`"],
	},
	texts: {
		type: [String],
		required: [true, "A message must have at least a `text`"],
	},
	context: String,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

