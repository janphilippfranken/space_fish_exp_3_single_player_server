let io;

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer, { cors: { origin: '*' } });
        // io = require('socket.io')(httpServer, { cors: { origin: '' } });
        return io;
    },
    getIo: () => {
        if (!io) throw new Error('Socket.io is not initialised');
        return io;
    }
};