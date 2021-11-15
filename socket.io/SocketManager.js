const writeData = require('../helpers/writeDataToFirebase');
const Participant = require('../models/participant');
const shuffleData = require('../stimuli');
const Room = require('../models/room');

// const play = () => {   
//     const beepsound = new Audio('https://www.soundjay.com/button/sounds/beep-01a.mp3');   
//     beepsound.play();   
// };   

// // play();


class SocketManager {
    constructor(io, socket, roomsRep, participantsRep) {
        this.io = io;
        this.socket = socket;
        this.roomsRep = roomsRep;
        this.participantsRep = participantsRep;
    }

    createParticipantObject() {
        this.socket.on('create-participant', participantName => {
            const participant = new Participant(participantName, this.socket.id);
            this.participantsRep.addParticipant(participant);
            this.socket.emit('participant-created', participant);
        });
    }

    lookingForRooms() {
        this.socket.on('looking-for-room', (participantId) => {
            const participant = this.participantsRep.getParticipantById(participantId);
            let room;
            if (this.roomsRep.isThereAnyAvailableRoom()) {
                // add the participant in the available room
                room = this.roomsRep.getAvailableRooms()[0];
                room.addParticipant(participant);
                // for other partiticpants assign other stimuli 
                const stimuli = shuffleData();
               
               
                participant.stimuli = stimuli[room.participants.length-1]
                if (room.participants.length === 3) {
                    room.hasTaskStarted = true;

                    // shuffles the stimuli
                    const stimuli = shuffleData();


                    // initial order of pp
                    const initRoomPP = [room.participants[0], room.participants[1], room.participants[2]];
                    
                    // now reordering pp in room randomly
                    room.participants[0] = initRoomPP[stimuli[3][0]];
                    room.participants[1] = initRoomPP[stimuli[3][1]];
                    room.participants[2] = initRoomPP[stimuli[3][2]];

                    // now assigning 1,2,3 order to shuffled pp
                    room.participants[0].stimuli = stimuli[0];
                    room.participants[1].stimuli = stimuli[1];
                    room.participants[2].stimuli = stimuli[2];


                    // room.participants.stimuli[0] = stimuli[stimuli[3][0]];
                    // room.participants.stimuli[1] = stimuli[stimuli[3][1]];
                    // room.participants.stimuli[2] = stimuli[stimuli[3][2]];

                    // room.participants[0].name = allNames[stimuli[3][0]];
                    // room.participants[1].name = allNames[stimuli[3][1]];
                    // room.participants[2].name = allNames[stimuli[3][2]];

                    // room.participants[0].id = allIDs[stimuli[3][0]];
                    // room.participants[1].id = allIDs[stimuli[3][1]];
                    // room.participants[2].id = allIDs[stimuli[3][2]];


                
                    console.log(room);
                    console.log(room.participants);
                    console.log(room.participants[0].stimuli)
                    console.log(room.participants[1].stimuli)
                    console.log(room.participants[2].stimuli)
                    // shuffle here 
                }
            } else {
                // there is no available room, create one
                room = new Room();
                // for first participant assign stimuli 0
                const stimuli = shuffleData();
                console.log(stimuli);
                participant.stimuli = stimuli[0];
                console.log(participant);
                room.addParticipant(participant);
                this.roomsRep.addRoom(room);
            }
            this.socket.join(room.id);
            this.io.in(room.id).emit('available-room', room);
        });
    }

    removerParticipantFromRoomDropOut() {
        this.socket.on('remove-participant-from-room--dropout', ({ roomId, participantId }) => {
            this.removingParticipant(true, roomId, participantId);
        });
    }

    removerParticipantFromRoomFinished() {
        this.socket.on('remove-participant-from-room--finished', ({ roomId, participantId }) => {
            this.removingParticipant(false, roomId, participantId);
        });
    }

    removingParticipant(didTheyDropOut, roomId, participantId) {
        if (!roomId || !participantId) return;
        const room = this.roomsRep.getRoomById(roomId);
        if (!room) return;
        this.socket.leave(room.id);
        room.removeParticipantById(participantId);
        if (didTheyDropOut && room.participants.length === 2) { // someone left after the game had started, so from 3 participants there are now 2
            this.io.in(room.id).emit('go-to-debrief', room);
        } else { // don't go to debrief, just update the other players that one of the participant left
            this.io.in(room.id).emit('update-room', room);
        }
        this.roomsRep.cleanUp(); // clean up all empty rooms
    }

    participantPlanetSelectionTrial() {
        this.socket.on('planet-selected', ( {planetSelectionTrial, roomId} ) => {
            console.log('data');
            console.log(roomId);
            // need room access 
            // roomname coming from client server 
            console.log(this.roomsRep);
            console.log('roomsRep');
     
            const room = this.roomsRep.getRoomById(roomId);
            console.log(room);
            console.log('room');
            if (room) {
                if (!room.planetSelections[planetSelectionTrial.participantId]) {
                    room.planetSelections[planetSelectionTrial.participantId] = [];
                };
                
                room.planetSelections[planetSelectionTrial.participantId].push(planetSelectionTrial);
                console.log(room);
                this.io.in(room.id).emit('update-room', room);
                
                console.log('debrief');
                console.log(planetSelectionTrial);
                // write data 
                writeData(room, room.id);
            } else if (!room) {
                console.log('managed to reach server');
                console.log(planetSelectionTrial);
                writeData(planetSelectionTrial, roomId);
            };

            
           
        });
    }

    participantDebrief() {
        this.socket.on('debrief-selected', ( {debriefDataF, roomId} ) => {
            
    
            // const room = this.roomsRep.getRoomById(roomId); 
            // room.planetSelections[planetSelectionTrial.participantId].push(debriefData);
            // console.log(room);
            // this.io.in(room.id).emit('update-room', room);
            
            // console.log('debrief');
            // console.log(planetSelectionTrial);
            // write data 
            console.log('managed to reach server');
            console.log(debriefDataF);
            writeData(debriefData, roomId);
           
        });
    }

}

module.exports = SocketManager;
