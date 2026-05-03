const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.cache.find(
        ch => ch.name === "🙋‍♂️丨الــتــرحــيــب・𝑤𝑒𝑙𝑐𝑜𝑚𝑒"
    );

    if (!channel) return;

    const memberCount = member.guild.memberCount;

    channel.send(
`♥︎ Welcome ${member}
★ You are member number ${memberCount}`
    );
});

// التوكن من Railway Variables
client.login(process.env.TOKEN);