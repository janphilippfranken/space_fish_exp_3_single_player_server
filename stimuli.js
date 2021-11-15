// note this is the single player version in which everyone is participant A = 0 = subject 1
const shuffle = require('./helpers/shuffleArray');

const shuffleData = () => {
    const indepJudgments = require('./independent_planet_judgments.json');
    const lrJudgments = require('./b_c_planet_judgments.json');
    randomRoom = Math.floor(Math.random() * 21); // 21 = n_rooms
    console.log(randomRoom);
    const conditions = shuffle(['lr', 'independent']);
    const randSubjMatch = [0,1,2];
    const randFishMatch = shuffle([0,1]); // 0 = red, 1 = blue 
    const selectedCondition = conditions[0];
    const FishA = randFishMatch[0]; // fish for subj
    const FishB = randFishMatch[1]; // fish for subj2
    const FishC = randFishMatch[0]; // fish for subj3
    
    var selectedJudgments;
    var bJudgments;
    var cJudgments;
    // allocating judgments to fake players
    if (selectedCondition === 'independent'){
        selectedJudgments = indepJudgments;
       
    } else if  (selectedCondition === 'lr'){
        selectedJudgments = lrJudgments;
    };

    bJudgments = selectedJudgments.B[randomRoom];
    cJudgments = selectedJudgments.C[randomRoom];

    const positions = shuffle([['67.5%', '71.75%', '0%', '3%', '75%'], ['77.25%', '81.5%', '26%', '29%', '85%'], ['87%', '91.5%', '50%', '55%', '95%']]); //left position percentages for subjects 1-3, innner arrays: 1)legend name, legend score, trial score name, trial score 
    const positionA = positions[0];
    const positionB = positions[1];
    const positionC = positions[2];
    

    const targetBeliefs = [['subject1', selectedCondition, FishA, positionA], ['subject2', selectedCondition, FishB, positionB, randomRoom, bJudgments], ['subject3', selectedCondition, FishC, positionC, randomRoom, cJudgments], randSubjMatch];
    return targetBeliefs;
};



module.exports = shuffleData;

