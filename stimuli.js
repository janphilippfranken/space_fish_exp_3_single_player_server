const { count } = require("console");
const fs = require("fs");
// note this is the single player version in which everyone is participant A = 0 = subject 1
const shuffle = require('./helpers/shuffleArray');

const shuffleData = () => {
    const randFishMatch = shuffle([0,1]); // 0 = red, 1 = blue  -> determines which color fish has that subj samples 
    const FishA = randFishMatch[0]; // fish for subj

    var indepJudgments;  // judg from other players 
    var lrJudgments;

    if (FishA === 0){    // if red for subj, play red flip version
        // indepJudgments = require('./independent_planet_judgments_red_flip.json');
        lrJudgments = require('./b_c_planet_judgments_red_flip.json');
    } else if (FishA === 1) { // else play blue flip version
        // indepJudgments = require('./independent_planet_judgments_blue_flip.json');
        lrJudgments = require('./b_c_planet_judgments_blue_flip.json');
    };
    
    const roomCount = require('./room_idx.json');  // determines which room we are using for the task 
    var countIncrement = roomCount.room; // increases each time and resets to 0 if all rooms have been used 
    if (countIncrement === 19) { // reset after reaching max n_rooms -> we have 19 rooms
        countIncrement = 0
    };

    const conditions = shuffle(['lr', 'lr']); // now randomly shuffle condition in which subject is in -> we here stick to 'lr', but can change to 2x2 by setting one to 'independent'
    const structureHint = shuffle(['weak', 'strong']); // new between subj manipulation 
    const selectedCondition = conditions[0];
    const selectedHint = structureHint[0];
    
    const randSubjMatch = [0,1,2];  // these variables are not relevant anymore for exp3 but are kept in case we want to change smth later
    const FishB = randFishMatch[1]; // fish for subj2
    const FishC = randFishMatch[0]; // fish for subj3
    
    console.log(FishA);
    console.log(selectedCondition);
    console.log(selectedHint);

    // now pick judgments for B and C from json files
    var selectedJudgments;
    var bJudgments;
    var cJudgments;
    
    // // allocating judgments to fake players
    // if (selectedCondition === 'independent'){
    //     selectedJudgments = indepJudgments;
       
    // } else if  (selectedCondition === 'lr'){
    //     selectedJudgments = lrJudgments;
    // };

    selectedJudgments = lrJudgments;

    bJudgments = selectedJudgments.B[countIncrement];
    cJudgments = selectedJudgments.C[countIncrement];

    console.log('length');
    console.log(selectedJudgments.C.length);

    // assign positions
    const positions = [['67.5%', '71.75%', '0%', '3%', '75%'], ['77.25%', '81.5%', '26%', '29%', '85%'], ['87%', '91.5%', '50%', '55%', '95%']]; //left position percentages for subjects 1-3, innner arrays: 1)legend name, legend score, trial score name, trial score 
    const positionA = positions[0];
    const positionB = positions[1];
    const positionC = positions[2];
    
    const targetBeliefs = [['subject1', selectedCondition, FishA, positionA, selectedHint], ['subject2', selectedCondition, FishB, positionB, countIncrement, bJudgments, selectedHint], ['subject3', selectedCondition, FishC, positionC, countIncrement, cJudgments, selectedHint], randSubjMatch];
    
    // increment and reseset room
    countIncrement = countIncrement + 1;
    roomCount.room = countIncrement;

    fs.writeFile('./room_idx.json', JSON.stringify(roomCount), function writeJSON(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(roomCount));
        console.log('writing to ' + './room_idx.json');
    });

    
    return targetBeliefs;


};



module.exports = shuffleData;

