import io from 'socket.io-client';
let socket = io.connect('http://localhost:7777');

export default socket;