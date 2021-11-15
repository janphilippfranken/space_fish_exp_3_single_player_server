// write data to firebase 
const fetch = require("node-fetch");

const URL = "https://space-fish-default-rtdb.europe-west1.firebasedatabase.app/";

const storeData = (data, roomID) => {
    fetch(URL + roomID + ".json", {
        method: "POST", headers: {"Application": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(res => res).catch(error => console.log(error));
};

module.exports = storeData;

