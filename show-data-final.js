const fs = require("fs");
const { AceBase } = require("acebase");

const options = {logLevel: 'error' };
const db = new AceBase("s1938897_space_fish_exp_3", options);
//const db = new AceBase("atullo2_three_players", options);
db.ready(() => {
  db.root.get(
    data => fs.writeFile(
      "test.json", JSON.stringify(data.val(),null,4), y => {process.exit(0)}
    )
  );
});