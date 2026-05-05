const fs = require("fs");
const path = require("path");

module.exports = function saveWarns() {
    fs.writeFileSync(
        path.join(__dirname, "warns.json"),
        JSON.stringify(require("./warns.json"), null, 2)
    );
};
