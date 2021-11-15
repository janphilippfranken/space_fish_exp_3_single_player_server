const { AceBaseServer } = require('acebase-server');
const settings = {
    host: 'localhost',
    port: process.env.ACEBASE_PORT,
    authentication: {
        enabled: false // ok as long as we trust everyone on this server?
    }
};
const server = new AceBaseServer(process.env.ACEBASE_DBNAME, settings);
server.on("ready", () => {
    console.log("SERVER ready");
});