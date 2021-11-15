const SocketManager = require('./SocketManager');

module.exports = (io, roomsRep, participantsRep) => {
    io.on('connection', socket => {
        const socketManager = new SocketManager(io, socket, roomsRep, participantsRep);
        socketManager.lookingForRooms();
        socketManager.createParticipantObject();
        socketManager.removerParticipantFromRoomDropOut();
        socketManager.removerParticipantFromRoomFinished();
        socketManager.participantPlanetSelectionTrial();
        socketManager.participantDebrief();
    });
};