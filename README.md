ws => npm i ws
const WebSocket = require('ws)
const wss = new WebSocket.Server({
port: 8080,
perMessageDeflate: {
zlibDeflateOptions: {
// see zlib defaults
chunkSize: 1024,
memLevel: 7,
level: 3
},
zlibInflateOptions: {
  chunkSize: 10 * 1024
},
// other options settable:
clientNoContextTakeover: true, // defaults to negotiated value
serverNoContextTekeover: true, // defaults to negitiated value
serverMaxWindowBits: 10, // Defaults to negitiated value
// belowoptions specified as default values
concurrencyLimit: 10,
theshold: 1024 // size (in bytes) below which messages
// should not be compressed
}
});

socket.io => npm i socket.io

websocket.io

node index.js - запуск сервера
