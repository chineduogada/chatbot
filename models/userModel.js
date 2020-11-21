const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: String,
	age: {
		type: Number,
		min: 15,
	},
	cryptoID: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;

