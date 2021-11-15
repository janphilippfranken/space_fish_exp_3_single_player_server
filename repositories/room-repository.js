class RoomRep {
    constructor() {
        this.rooms = [];
    }

    cleanUp() {
        this.rooms = this.rooms.filter(room => !room.isEmpty());
    }

    addRoom(room) {
        this.rooms.push(room);
    }

    getRoomById(id) {
        return this.rooms.filter(room => room.id === id)[0];
    }

    addParticipantToRoom(participant, roomId) {
        const room = this.getRoomById(roomId);
        room.addParticipant(participant);
    }

    isThereAnyAvailableRoom() {
        return !!this.getAvailableRooms().length;
    }

    getAvailableRooms() {
        return this.rooms.filter(room => room.isRoomAvailable());
    }

    removeParticipantFromRoom(participantId, roomId) {
        const room = this.getRoomById(roomId);
        room && room.removeParticipantById(participantId);
        return room;
    }
}

let roomsRep;
module.exports = {
    initRooms: () => {
        roomsRep = new RoomRep();
        return roomsRep;
    },

    getRooms: () => {
        if (!roomsRep) throw new Error('Rooms repository has not been initialised');
        return roomsRep;
    }
};