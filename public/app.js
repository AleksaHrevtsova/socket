const socket = io("ws://localhost:8080");

// http://   || https://
// ws: //    || wss://

const refs = {
  messageEditor: document.querySelector("#message-editor"),
  feed: document.querySelector("#message-feed"),
  input: document.querySelector('[name="message"]'),
  exit: document.querySelector(".exit"),
};

const name = prompt(`Enter your name`);
// send
socket.emit("user/joinChat", name);

// // listen
socket.on("user/joinChatSuccess", (msg) => {
  console.log(msg);
});

socket.on("user/userJoined", (msg) => {
  console.log(msg);
});

socket.on("user/connected", (history) => {
  const item = history
    .map(({ author, msg, time }) => {
      const { hours, minutes } = getTime(time);

      return `
      <li>
      <b>${author}</b> ${hours}-${minutes}
      <p>${msg}</p>
      </li>`;
    })
    .join("");
  refs.feed.insertAdjacentHTML("beforeend", item);
});

// слушаем форму, получаем значение из инпута
refs.messageEditor.addEventListener("submit", sendMsg);
function sendMsg(e) {
  e.preventDefault();
  const msg = e.currentTarget.elements.message.value;
  // console.log(msg);
  if (msg) {
    socket.emit("chat/newMessage", msg);
  } else {
    alert(`введите сообщение!`);
  }
  refs.input.value = "";
}

// отрисовываем значение из инпута
socket.on("chat/newMessage", showMsg);

function showMsg({ author, msg, time }) {
  const { hours, minutes } = getTime(time);
  const item = `
    <li>
      <b>Автор: ${author}</b> Время: ${hours}-${minutes}
      <p>${msg}</p>
    </li>`;
  refs.feed.insertAdjacentHTML("beforeend", item);
  refs.feed.scrollTo = refs.feed.scrollHeight;
}

function getTime(time) {
  const t = new Date(time);
  const hours = t.getHours();
  const minutes = t.getMinutes();

  return { hours, minutes };
}

