const BOT_NAME = "mr bot";
const Message = require("./../models/messageModel");
const { log } = require("console");

const getRandMessage = (messages) =>
	messages[Math.floor(Math.random() * messages.length)];

exports.emitWelcomeMsg = (socket) =>
	socket.emit("chat", {
		name: BOT_NAME,
		msg:
			"hello welcome to our platform, i'm your assistant and how may i help?",
	});

exports.onClientChat = (socket) =>
	socket.on("chat", async ({ msg }) => {
		let data = {};

		try {
			const messages = await Message.find().select("-__v");

			const group = [];

			// messages.forEach((message) => {
			// 	group.push(message.patterns);
			// });

			// for (let i = 0; i < group.length; i++) {
			// 	const patterns = group[i];

			// 	patterns.find()

			// 	console.log(patterns);
			// }

			const message = messages.find((message) => {
				return message.patterns.includes(
					message.patterns.find((pattern) => `${msg}`.includes(pattern))
				);
			});

			if (message) {
				data = {
					msg: getRandMessage(message.texts),
					name: BOT_NAME,
					context: message.context,
				};
			} else {
				data = {
					name: BOT_NAME,
					msg: "Sorry i don't understand you",
					group,
				};
			}

			socket.emit("chat", data);
		} catch (err) {
			log(err);
			data = {
				name: BOT_NAME,
				msg: "Sorry, an unexpected error occurred!",
			};

			socket.emit("chat", data);
		}
	});

exports.onDisconnect = (socket) =>
	socket.on("disconnect", () => {
		log(`The user with the connectionID: ${socket.id} has disconnected`);
	});

