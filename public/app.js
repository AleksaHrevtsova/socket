const socket = io("ws://localhost:8080");

const refs = {
  messageEditor: document.querySelector("#message-editor"),
  feed: document.querySelector("#message-feed"),
  close: document.querySelector('[name="close"]'),
};

const userName = prompt(`Enter your name`);

// send
socket.emit("user/joinChat", userName);

// listen
socket.on("user/joinChatSuccess", (msg) => {
  console.log(msg);
});

socket.on("user/userJoined", (msg) => {
  console.log(msg);
});

socket.on("chat/newMessage", addMsg);

function addMsg({ author, msg, time }) {
  const { hours, minutes } = getTime(time);
  const item = `
    <li>
      <b>${author}</b> ${hours}-${minutes}
      <p>${msg}</p>
    </li>`;
  refs.feed.insertAdjacentHTML("beforeend", item);
  refs.feed.scrollTo = refs.feed.scrollHeight;
}

refs.messageEditor.addEventListener("submit", editor);
function editor(e) {
  e.preventDefault();
  const msg = e.currentTarget.elements.message.value;
  console.log(msg);

  socket.emit("chat/newMessage", msg);
}

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

function getTime(time) {
  const t = new Date(time);
  const hours = t.getHours();
  const minutes = t.getMinutes();

  return { hours, minutes };
}
