class ParticipantRep {
    constructor(){ 
        this.participants = [];
    }    

    addParticipant(participant) {
        if (!this.getParticipantById(participant.id)) this.participants.push(participant);
    }

    removeParticipantById(id) {
        this.participants = this.participants.filter(participant => participant.id !== id);
    }

    getParticipantById(id) {
        return this.participants.filter(participant => participant.id === id)[0];
    }
}


let participantRep;
module.exports = {
    initParticipants: () => {
        participantRep = new ParticipantRep();
        return participantRep;
    },

    getParticipants: () => {
        if (!participantRep) throw new Error('Participants repository has not been initialised');
        return userRep;
    }
};