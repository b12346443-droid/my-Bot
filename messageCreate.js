const moderation = require("../commands/moderation");

module.exports = (client, message) => {
    if (!message.content.startsWith("-")) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const cmd = args.shift();

    moderation.prefix(client, message, cmd, args);
};
