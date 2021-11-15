const roomIdGenerator = require('../helpers/generate_room_name');
class Room {
    constructor () {
        this.participants = [];
        this.id = roomIdGenerator(10);
        this.hasTaskStarted = false;
        this.commonData = false;
        this.planetSelections = {};
    }

    addParticipant(participant) {
        if (this.isRoomAvailable()) {
            this.participants.push(participant)
        } 
    }

    hasParticipantWithId(id) {
        return this.participants.some(participant => participant.id === id);
    }

    removeParticipantById(id) {
        try {
            this.participants = this.participants.filter(participant => participant.id !== id);
        } catch {}
    }

    isEmpty() {
        return !!!this.participants.length;
    }

    isRoomAvailable() {
        return this.participants.length < 3 && !this.hasTaskStarted;
    }
}

module.exports = Room;