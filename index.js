const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// دخول + ترحيب + لوق (كلها مع بعض)
client.on("guildMemberAdd", async (member) => {

    // 🔵 ترحيب
    const welcomeChannel = member.guild.channels.cache.find(
        ch => ch.name === "🙋‍♂️丨الــتــرحــيــب・𝑤𝑒𝑙𝑐𝑜𝑚𝑒"
    );

    if (welcomeChannel) {
        welcomeChannel.send(`♥︎ Welcome ${member}
★ You are member number ${member.guild.memberCount}`);
    }

    // 🟢 لوق دخول
    const logChannel = client.channels.cache.get("1428876171411456145");
    if (!logChannel) return;

    try {
        logChannel.send(`
📥 عضو دخل السيرفر

👤 الاسم: ${member.user.tag}
🆔 الايدي: ${member.user.id}

📅 تاريخ الحساب: <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>

👥 عدد الأعضاء الآن: ${member.guild.memberCount}
        `);
    } catch (error) {
        console.log(error);
    }
});

// لوق حذف الرومات
client.on("channelDelete", async (channel) => {
    const logChannel = client.channels.cache.get("1428876164574740501");
    if (!logChannel) return;

    try {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: 12,
            limit: 1
        });

        const audit = fetchedLogs.entries.first();
        if (!audit) return;

        const executor = audit.executor;

        logChannel.send(`
🗑️ تم حذف روم

👤 بواسطة: ${executor.tag}
📛 اليوزر: ${executor.username}
🆔 الايدي: ${executor.id}

📂 اسم الروم المحذوف: ${channel.name}

⏰ الوقت: <t:${Math.floor(Date.now() / 1000)}>
        `);

    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN);