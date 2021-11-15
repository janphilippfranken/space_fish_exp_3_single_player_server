const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();

app.use(cors());


router.get('/', (req, res) => {
    res.json({})
});

app.use(router);

const server = app.listen(process.env.PORT || 5000, function() {
    console.log("Server's up on port: " + this.address().port);
});

const io = require('./socket.io/socket-setup').init(server);
const roomsRep = require('./repositories/room-repository').initRooms();
const participantsRep = require('./repositories/participant-repository').initParticipants();
require('./socket.io/socket-on-connection')(io, roomsRep, participantsRep); 


