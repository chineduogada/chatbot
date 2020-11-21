require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const { log } = require("console");

const app = require("./app");
const chatController = require("./controllers/chatController");

const server = http.createServer(app);
const io = socketIo(server);

mongoose
	.connect(process.env.DATABASE_LOCAL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => log("successfully connected to mongodb..."))
	.catch((ex) => log(ex, "couldn't connect to mongodb"));

io.on("connection", (socket) => {
	// chatController.emitWelcomeMsg(socket);

	chatController.onClientChat(socket);

	socket.on("signup", ({ msg }) => {
		log(msg);
	});

	chatController.onDisconnect(socket);
});

const PORT = process.env.NODE_ENV || 8080;

server.listen(PORT, () => log(`Server has started on port: ${PORT}...`));

