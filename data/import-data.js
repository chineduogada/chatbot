const mongoose = require("mongoose");
const fs = require("fs");
const Message = require("../models/messageModel");

// SET ENV VARIABLES
require("dotenv").config();

// CONNECT TO THE DB
mongoose
	.connect(process.env.DATABASE_LOCAL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log("DB connection successful"))
	.catch((ex) => console.log(ex, "failed to connect to the DB"));

// READ JSON FILE
const messages = JSON.parse(
	fs.readFileSync(`${__dirname}/messages.json`, "utf-8")
);
// IMPORT DATA INTO DB
const importData = async () => {
	try {
		await Message.create(messages);
		console.log("Data successfully loaded...");
	} catch (ex) {
		console.log(ex, "failed to import data into db!!!!");
	}
	process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
	try {
		await Message.deleteMany();
		console.log("All data successfully deleted...");
	} catch (ex) {
		console.log(ex, "failed to delete all data into db!!!!");
	}
	process.exit();
};

if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
} else {
	console.log(
		'please specify either of the flags \n --> "--delete" or "--import" <--'
	);
	process.exit();
}

