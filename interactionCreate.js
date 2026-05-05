const moderation = require("../commands/moderation");

module.exports = (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    moderation.slash(client, interaction);
};
