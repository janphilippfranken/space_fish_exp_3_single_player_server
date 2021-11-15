// // write data to acebase 
const { AceBaseClient } = require("acebase-client");

const db = new AceBaseClient({
    autoConnect: false,
    dbname: process.env.ACEBASE_DBNAME,
    host: 'localhost',
    port: process.env.ACEBASE_PORT,
    https: false,
  
});

// Keep retrying connection to server with a 1s timeout in between.
// This is needed because the Acebase server may not be up yet!
function try_db() {
    db.connect().then(
       (result) => {
           /* resolved, do nothing and loop will exit as it has connected */ 
           console.log("Connected to Acebase server.");
       },
       (result) => {
           /* rejected, try again in 5s */
           console.error(
               "Failed to connect to Acebase server, reason:\n"
               +result+"\n"
               +"Retrying ....\n"
           );
           setTimeout(try_db, 1000);
       }
    );
}
try_db();

const storeData = (data, roomID) => {
    console.log('stored');
    console.log(data);
    db.ref(roomID)
      .push(data)
      .then(res => res)
      .catch(error => console.log(error));
};

module.exports = storeData;