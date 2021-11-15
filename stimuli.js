const shuffle = require('./helpers/shuffleArray');

const shuffleData = () => {
    const conditions = shuffle(['lr', 'independent']);
    const randSubjMatch = shuffle([0,1,2]);
    const randFishMatch = shuffle([0,1]); // 0 = red, 1 = blue 
    const selectedCondition = conditions[0];
    const FishA = randFishMatch[0]; // fish for subj1
    const FishB = randFishMatch[1]; // fish for subj2
    const FishC = randFishMatch[0]; // fish for subj3

    const positions = shuffle([['67.5%', '71.75%', '0%', '3%', '75%'], ['77.25%', '81.5%', '26%', '29%', '85%'], ['87%', '91.5%', '50%', '55%', '95%']]); //left position percentages for subjects 1-3, innner arrays: 1)legend name, legend score, trial score name, trial score 

    const positionA = positions[0];
    const positionB = positions[1];
    const positionC = positions[2];
    

    const targetBeliefs = [['subject1', selectedCondition, FishA, positionA], ['subject2', selectedCondition, FishB, positionB], ['subject3', selectedCondition, FishC, positionC], randSubjMatch];
    return targetBeliefs;
};



module.exports = shuffleData;

