const cta_button = document.querySelector(".cta");
const scroll_button = document.querySelector(".scroll-btn");
const chatBox_div = document.querySelector(".chat-box");
const messages_ul = document.querySelector(".messages");
const form = document.querySelector(".form");
const input = document.querySelector(".form__input");

const state = {
	chatBoxIsClose: true,
	isLoading: false,
	startSignUp: false,
};

const scrollToBottom = () => {
	messages_ul.scrollTop = messages_ul.scrollHeight;
};

const displayChat = (markup, isLoading = false) => {
	state.isLoading = isLoading;
	messages_ul.innerHTML += markup;
	scrollToBottom();
};

const openChat = () => {
	chatBox_div.classList.remove("chat-box--hide");
	state.chatBoxIsClose = false;
	input.focus();
};
const closeChat = () => {
	chatBox_div.classList.add("chat-box--hide");
	state.chatBoxIsClose = true;
};

cta_button.addEventListener("click", ({ target }) => {
	if (state.chatBoxIsClose) {
		openChat(target);
		target.innerHTML = "x";
	} else {
		closeChat(target);
		target.innerHTML = "+";
	}
});

const socket = io.connect("http://localhost:4000");

socket.on("chat", ({ name, msg, context }) => {
	const loading_markup = `
    <li class="message message--bot message--loading">
      <span class="message-dot"></span>
      <span class="message-dot"></span>
      <span class="message-dot"></span>
    </li>
  `;

	const message_markup = `
    <li class="message message--bot ${
			context === "error"
				? "message--error"
				: context === "complicated"
				? "message--complicated"
				: ""
		}">
      <h5 class="message__name">${name}</h5>
      <p class="message__text">
        ${msg}
      </p>
    </li>
  `;

	if (context === "start signup") {
		state.startSignUp = "pending";
	}

	displayChat(loading_markup, true);

	setTimeout(() => {
		messages_ul.removeChild(
			messages_ul.children[messages_ul.children.length - 1]
		);

		displayChat(message_markup);
	}, Math.floor(Math.random() * 300 + 1201));
});

form.addEventListener("submit", (e) => {
	e.preventDefault();

	if (!state.isLoading) {
		const { value: msg } = input;

		if (msg.length > 1) {
			if (state.startSignUp === "pending" && state.startSignUp !== true) {
				if (
					msg.includes("yes") ||
					msg.includes("ok") ||
					msg.includes("sure") ||
					msg.includes("i want that") ||
					msg.includes("why not") ||
					msg.includes("no problem")
				) {
					console.log("start signup");
					socket.emit("signup", { msg: "yes" });
					state.startSignUp = true;
				} else {
					socket.emit("signup", { msg: "no" });
					state.startSignUp = false;
				}
			}

			socket.emit("chat", { name: "unknown", msg });

			const message_markup = `
				<li class="message message--client">
					<h5 class="message__name">me</h5>
					<p class="message__text">
						${msg}
					</p>
				</li>
			`;

			displayChat(message_markup);
			input.value = "";
		}
	}
});

scroll_button.addEventListener("click", scrollToBottom);

