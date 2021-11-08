import Ws from 'App/Services/Ws';
Ws.boot();

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
  socket.emit('success', { hello: 'world' });
});
