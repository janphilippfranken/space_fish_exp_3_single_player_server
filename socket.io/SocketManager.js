const writeData = require('../helpers/writeDataToAcebase');
const Participant = require('../models/participant');
const shuffleData = require('../stimuli');
const Room = require('../models/room');



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
                
                if (room.participants.length === 3) { // this stuff only gets evaluated if other real people join, in the sinlge player version, we just predefine everything for the other two
                    room.hasTaskStarted = true;
                    // console.log('started');
                    const stimuli = shuffleData();
                    const initRoomPP = [room.participants[0], room.participants[1], room.participants[2]];   
                    // reordering pp in room randomly
                    room.participants[0] = initRoomPP[stimuli[3][0]];
                    room.participants[1] = initRoomPP[stimuli[3][1]];
                    room.participants[2] = initRoomPP[stimuli[3][2]];
                    // assigning 1,2,3 order to shuffled pp
                    room.participants[0].stimuli = stimuli[0];
                    room.participants[1].stimuli = stimuli[1];
                    room.participants[2].stimuli = stimuli[2];
                }
            } else {
                room = new Room();
                const stimuli = shuffleData();
                participant.stimuli = stimuli[0];
                // adding the real player
                room.addParticipant(participant); 
                // adding fake players
                const player2 = {name: 'jax',
                                id: 'simulated_player_two',
                                stimuli: ['subject2', 'independent', 1, [ '67.5%', '71.75%', '0%', '3%', '75%' ]] // this will be overwritten 
                            };

                const player3 = {name: 'tia',
                                 id: 'simulated_player_three',
                                 stimuli: ['subject3', 'independent', 1, [ '67.5%', '71.75%', '0%', '3%', '75%' ]]
                            };

                room.addParticipant(player2); 
                room.addParticipant(player3); 
                this.roomsRep.addRoom(room);
                room.hasTaskStarted = true;
  
                // now assigning 1,2,3 order to shuffled pp
                room.participants[0].stimuli = stimuli[0];
                room.participants[1].stimuli = stimuli[1];
                room.participants[2].stimuli = stimuli[2];
                // console.log('started');
                // console.log(room);
                // console.log(room.participants[0].stimuli);
                // console.log(room.participants[1].stimuli);
                // console.log(room.participants[2].stimuli);
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
            const sim2 = 'simulated_player_two';
            const sim3 = 'simulated_player_three';
            const room = this.roomsRep.getRoomById(roomId);
            if (room) {
                if (!room.planetSelections[planetSelectionTrial.participantId]) {
                    room.planetSelections[planetSelectionTrial.participantId] = [];
                    room.planetSelections['simulated_player_two'] = [];
                    room.planetSelections['simulated_player_three'] = [];
                };
                
                room.planetSelections[planetSelectionTrial.participantId].push(planetSelectionTrial); // real participant
                
                const trial = room.planetSelections[planetSelectionTrial.participantId].length;
                var trialIdx = trial;
                var bIdx = 1;
                var cIdx = 2;
                if (trial === 11){
                    trialIdx = 10
                    bIdx = 0;
                    cIdx = 1;
                };
                // console.log(room.participants);
                // console.log('test');
                // console.log(trial);
                const bJugdment = room.participants[bIdx].stimuli[5][trialIdx-1];
                const cJugdment = room.participants[cIdx].stimuli[5][trialIdx-1];
                const roomNumber = room.participants[1].stimuli[4];

                var bJugdmentColor = "lightgrey";
                var cJugdmentColor = "lightgrey";

                if (bJugdment < 0){
                    bJugdmentColor = 'deepskyblue'
                } else if (bJugdment > 0) {
                    bJugdmentColor = 'red'
                };

                if (cJugdment < 0){
                    cJugdmentColor = 'deepskyblue'
                } else if (cJugdment > 0) {
                    cJugdmentColor = 'red'
                };

                // fake participants 
                const simPlayerTwoSelections = {
                    participantId: 'simulated_player_two',
                    confidence: Math.abs(bJugdment),
                    color: bJugdmentColor,
                    conditionNumber: planetSelectionTrial.participantId.conditionNumber,
                    participantPID: { PID: 'x' },
                    participantNumber: 'subject2',
                    globalCondition: planetSelectionTrial.participantId.globalCondition,
                    globalFish: planetSelectionTrial.participantId.globalFish,
                    simulatedResponse: true,
                    structureHint: planetSelectionTrial.participantId.structureHint,
                    IPAdress: planetSelectionTrial.participantId.IPAdress,
                    training: { training: 'x' },
                    socialTraining: { socialTraining: 'x' },
                    socialTrainingStructure: { socialTrainingStructure: 'x' },
                    roomNumber: roomNumber
                }

                const simPlayerThreeSelections = {
                    participantId: 'simulated_player_three',
                    confidence: Math.abs(cJugdment),
                    color: cJugdmentColor,
                    conditionNumber: planetSelectionTrial.participantId.conditionNumber,
                    participantPID: { PID: 'x' },
                    participantNumber: 'subject3',
                    globalCondition: planetSelectionTrial.participantId.globalCondition,
                    globalFish: planetSelectionTrial.participantId.globalFish,
                    simulatedResponse: true,
                    structureHint: planetSelectionTrial.participantId.structureHint,
                    IPAdress: planetSelectionTrial.participantId.IPAdress,
                    training: { training: 'x' },
                    socialTraining: { socialTraining: 'x' },
                    socialTrainingStructure: { socialTrainingStructure: 'x' },
                    roomNumber: roomNumber
                };

                room.planetSelections['simulated_player_two'].push(simPlayerTwoSelections);
                room.planetSelections['simulated_player_three'].push(simPlayerThreeSelections);
             
                // console.log(room);
                this.io.in(room.id).emit('update-room', room);
                
                // console.log('debrief');
                // console.log(planetSelectionTrial);
                writeData(room, room.id);
            } else if (!room) {
                // console.log('managed to reach server');
                // console.log(planetSelectionTrial);
                writeData(planetSelectionTrial, roomId);
            };

            

            
           
        });
    }

    participantDebrief() {
        this.socket.on('debrief-selected', ( {debriefDataF, roomId} ) => {
            // write data 
            // console.log('managed to reach server');
            // console.log(debriefDataF);
            writeData(debriefData, roomId);
           
        });
    }

}

module.exports = SocketManager;
