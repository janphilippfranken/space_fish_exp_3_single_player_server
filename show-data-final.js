const fs = require("fs");
const { AceBase } = require("acebase");
const db = new AceBase('s1938897_three_players', { logLevel: 'error', storage: { path: './' } })
db.ready(async () => {
  const fstream = fs.createWriteStream('export.json', { flags: 'w+' });
  const stream = {
      write: chunk => {
        const ok = fstream.write(chunk);
        if (!ok) {
          return new Promise(resolve => fstream.once('drain', resolve));
        }
      }
  };
  await db.root.export(stream);
  fstream.close(); 
});

// await db.root.export(stream);
  // fstream.close(); 
// 
